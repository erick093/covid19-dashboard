import React,{Component} from "react";
import {tweetsStream} from "../Api";
import { debounce} from 'rxjs/operators';
import {Subject,interval} from 'rxjs';

let stream = new Subject();
class Tweet extends Component {
    state = {
        tweetInfo:{
            'name': "",
            'screen_name':"",
            'text':"",
            'profile_image_url':"",
            'profile_background_image_url':"",
            'id':"",
            "profile_banner_url":""
        }
    }

    initTweetStream() {
        tweetsStream(stream);
        stream.pipe(debounce(() => interval(1500)) )
            .subscribe(data => {
                this.setState( {tweetInfo:data} )
            })
    }
    componentDidMount() {
        this.initTweetStream();
    }

    render() {
        return(

            <div className="card card-user">
                <div className="card-image">
                    <img
                        src={this.state.tweetInfo.profile_banner_url}
                        alt="..." />
                </div>
                <div className="card-body">
                    <div className="author">
                        <a href={"https://twitter.com/"+this.state.tweetInfo.screen_name} target="-_blank"   >
                            <img className="avatar border-gray" src={this.state.tweetInfo.profile_image_url} alt="..." />
                                <h5 className="title">{this.state.tweetInfo.name}</h5>
                        </a>
                        <p className="description">
                            @{this.state.tweetInfo.screen_name}
                        </p>
                    </div>
                    <p className="description text-center">
                        {this.state.tweetInfo.text}
                    </p>
                </div>
                <hr/>
            </div>


    )

    }
}

export default Tweet;