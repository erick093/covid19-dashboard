const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const Twitter = require('node-tweet-stream')
const RxHR = require('@akanass/rx-http-request').RxHR;
const { map, filter, reduce, distinct,distinctUntilChanged,concatMap,mergeMap,toArray } = require('rxjs/operators');
const {from} = require('rxjs');
//const cors = require("cors");
const { response } = require('express');
//app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

const PORT = process.env.PORT || 9000
const OPEN_DATA = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/'
const GLOBAL_DATA = 'https://corona-api.com/countries'
t = new Twitter({
    consumer_key: 'PJockockOEo3Z2eKDwxlTrrUp',
    consumer_secret: 'S3tqTYpsKCdicROexXeYkCxwPcN0NYCfnoaRWcfpJFSffoWaHP',
    token: '1609003328-ERcHxUR0uTd47ioL54S02aBBUztl8XgLwaCcWDZ',
    token_secret: '6o3Db3lo6DyWDj4NOpDlmJeQVhqoB8sJwLNqa2CUSZSLg'
})

t.on('tweet', function (tweet) {
    console.log('tweet received: ', tweet.text)
})
//t.track('covid')
// const options = {
//     method: 'GET',
//     url: 'https://disease.sh/v3/covid-19/all',
//     headers: {
//     }
// };
// app.get('/', (req, res, next ) => {
//
//     res.send({title:"Backed init"});
// });
// app.get('/dashboard', (req, res, next ) => {
//
//     res.send({title:"Backed init"});
// });

const globalData$ = RxHR.get(`${GLOBAL_DATA}`,{json:true}).pipe(map( response => response.body));
const textGlobalData = globalData$.pipe(
    map( data => data.data.map(
        element => element.latest_data)
    )
);

app.get('/globalDeaths',(req, res, next) => {
    const sumDeaths = textGlobalData.pipe( map( data =>
        data.reduce( (acc,val) =>
            acc + parseInt(val.deaths),0 )
    ));

    sumDeaths.subscribe( data => res.send({deaths: data }));
});


app.get('/globalConfirmed',(req, res, next) => {
    const sumConfirmed = textGlobalData.pipe( map( data =>
        data.reduce( (acc,val) =>
            acc + parseInt(val.confirmed),0 )
    ));

    sumConfirmed.subscribe( data => res.send({confirmed: data}));
});

app.get('/globalRecovered',(req, res, next) => {
    const sumRecovered = textGlobalData.pipe( map( data =>
        data.reduce( (acc,val) =>
            acc + parseInt(val.recovered),0 )
    ));

    sumRecovered.subscribe( data => res.send({recovered: data}));
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


//const BASE_PATH = `https://maciejtreder.github.io/asynchronous-javascript`;

// const directorId$ = testi$.pipe(
//     map(directors => directors.find(director => director.name === "Quentin Tarantino").id)
// );
// const belgi = testi$.pipe(
//     map(countries => countries.find(country => country.countriesAndTerritories === "Belgium").cases)
// );
// const belgi = testi$.pipe(
//     map(countries => countries.records.filter(country => country.countriesAndTerritories === "Belgium"))
// );
//testi$.subscribe(console.log);
//belgi.subscribe(console.log);
//directorId$.subscribe(console.log);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});





