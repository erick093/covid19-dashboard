import {Component} from "react";
import {map} from 'rxjs/operators';
import {getGlobalConfirmed,getGlobalDeaths,getGlobalRecovered} from "../Api";

export default class Cards extends Component {
    state = {
        globalDeaths :0,
        globalConfirmed: 0,
        globalRecovered: 0,
    }
    componentDidMount() {
    this.setGlobalDeaths();
    this.setGlobalConfirmed();
    this.setGlobalRecovered();

    }

    setGlobalDeaths(){
        getGlobalDeaths().pipe(
            map( data => data.deaths )
        ).subscribe( (value) =>{ this.setState({globalDeaths:value })});
    }
    setGlobalConfirmed(){
        getGlobalConfirmed().pipe(
            map( data => data.confirmed )
        ).subscribe( (value) =>{ this.setState({globalConfirmed:value })});
    }
    setGlobalRecovered(){
        getGlobalRecovered().pipe(
            map( data => data.recovered )
        ).subscribe( (value) =>{ this.setState({globalRecovered:value })});
    }

    componentDidUpdate() {

    }

    render() {
        return(
            <div className="row">
                <div className="col-md-3">
                    <div className="card-counter danger">
                        <i className="fa fa-hospital-o"></i>
                        <span className="count-numbers">{this.state.globalDeaths.toLocaleString()}</span>
                        <span className="count-name">Global deaths</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card-counter success">
                        <i className="fa fa-heart"></i>
                        <span className="count-numbers">{this.state.globalRecovered.toLocaleString()}</span>
                        <span className="count-name">Global recovered cases</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card-counter primary">
                        <i className="fa fa-user-md"></i>
                        <span className="count-numbers">{this.state.globalConfirmed.toLocaleString()}</span>
                        <span className="count-name">Global confirmed cases</span>
                    </div>
                </div>
            </div>

        )
    }
}