const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const Twitter = require('node-tweet-stream')
const RxHR = require('@akanass/rx-http-request').RxHR;
const { map, filter, reduce, distinct,mergeMap,toArray } = require('rxjs/operators');
const {from} = require('rxjs');
//const cors = require("cors");
const { response } = require('express');
const http = require('http');
//app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*'}});


const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));


const OPEN_DATA = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/';
const GLOBAL_DATA = 'https://corona-api.com/countries';
const PORT = process.env.PORT || 9000;


server.listen(PORT);

t = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    token: '',
    token_secret: ''
})

io.on('connection', socket => {
    t.track('covid');
    t.on('tweet', function (tweet) {
        if(tweet.user.verified){
            const data = {
                'name': tweet.user.name,
                'screen_name': tweet.user.screen_name,
                'profile_image_url': tweet.user.profile_image_url,
                'profile_background_image_url': tweet.user.profile_background_image_url,
                'user': tweet.user,
                'id': tweet.user.id,
                "profile_banner_url": tweet.user.profile_banner_url,
                'text': tweet.text,
                'retweet_count': tweet.retweet_count,
                'hashtags': tweet.entities.hashtags
            }
            //console.log('tweet received: ', tweet);
            socket.emit('tweet', data);
        }

    })
});

const globalData$ = RxHR.get(`${GLOBAL_DATA}`,{json:true}).pipe(
    map( response => response.body));
const textGlobalData = globalData$.pipe(
    map( data => data.data.map(
        element => element.latest_data)
    )
);

app.get('/globalDeaths',(req, res, next) => {

    const sumDeaths = textGlobalData.pipe(
        map( data => data.map( val=> val.deaths )),
    );
    sumDeaths.subscribe( data => from(data)
        .pipe(reduce((acc,val) => acc + parseInt(val),0))
        .subscribe(data => res.send({deaths: data }))
    );
});


app.get('/globalConfirmed',(req, res, next) => {

    const sumConfirmed = textGlobalData.pipe(
        map( data => data.map( val => val.confirmed )),
    );
    sumConfirmed.subscribe( data => from(data)
        .pipe(reduce((acc,val) => acc + parseInt(val),0))
        .subscribe(data => res.send({confirmed: data }))
    );

});

app.get('/globalRecovered',(req, res, next) => {
    const sumRecovered = textGlobalData.pipe(
        map( data => data.map( val=> val.recovered )),
    );
    sumRecovered.subscribe( data => from(data)
        .pipe(reduce((acc,val) => acc + parseInt(val),0))
        .subscribe(data => res.send({recovered: data }))
    );

});

app.post("/casesWeekly",(req,res,next) => {
    const body = req.body;
    const countryText = body['country'];
    const weeklyCases$ = RxHR.get(`${OPEN_DATA}`, {json: true}).pipe(map(response => response.body));
    const countryWeeklyCases = weeklyCases$.pipe(
        map(countries => countries.records.filter(country => country.countriesAndTerritories === countryText)
        )
    );
    countryWeeklyCases.subscribe(data => res.send(data));
    //countryWeeklyCases.subscribe(console.log)
   
})
let ListOfCountries = [];
let Status = false;
const countries$ = RxHR.get(`${OPEN_DATA}`, {json: true}).pipe(
    map(response => response.body),
    mergeMap( countries => countries.records.map(data =>  data.countriesAndTerritories) ),
    distinct( data => data),
    toArray()
);
countries$.subscribe(data => ListOfCountries = data,
 Status = true );

app.get("/getListCountries", (req, res, next) => {
if(Status){
    res.send(ListOfCountries);
}
});







