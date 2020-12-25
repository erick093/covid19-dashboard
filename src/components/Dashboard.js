import React, { Component } from 'react'
import { map} from 'rxjs/operators';
import WeeklyChart from './Charts'
import Cards from './Cards'
import {getCountryData, getListCountries} from "../Api"
import SearchBar from "./Searchbar";


class Dashboard extends Component {

  state = {
    message: "",
    countryText: "Please select a country.",
    objectResponse: {},
    arrayCountries: {},
    searchKey : "",
    isLoading: true,

  }
  callbackFunction = (childData) => {
    this.setState({countryText:childData})
    this.setState({isLoading:true})
    getCountryData({country: childData}).pipe(
        map( data =>{
          return data.map(element => {
            return { date: element["dateRep"].split("/").reverse().join("-"), cases_weekly: element["cases_weekly"], deaths_weekly: element["deaths_weekly"]}
          })

        })
    )
        .subscribe((value) =>{
          console.log("Country: ", this.state.countryText)
          this.setState({objectResponse:value})
          this.setState({isLoading:false})
        });
  }


  componentDidMount(){
    console.log("Component: Dashboard mounted correctly");
    //this.updateCountryData();
    //testAPI();
    //this.getArrayCountries();
    //getListCountries();
    //this.countryDisplayData();

  }
  componentDidUpdate(){
    if(!this.state.isLoading){
      console.log(this.state.countryText)
      console.log(this.state.objectResponse)
    }

  };

  getArrayCountries(){
    getListCountries().pipe(
        map(data => data)
    ).subscribe( data => this.setState({arrayCountries:data}))
  }


    render() {
        return(
            <div className="content">
            <div className="container-fluid">
              <SearchBar parentCallback ={ this.callbackFunction} />
              <div className="row">

                {  !this.state.isLoading ? (
                <WeeklyChart dataArray = {this.state.objectResponse}  countryName = {this.state.countryText} isLoading = {this.state.isLoading}/>
                    ):(
                    <div className="col-md-8">
                      <div className="card">
                        <div className="card-header ">
                          <h4 className="card-title">Weekly cases: {this.state.countryText} </h4>
                          <p className="card-category">24 Hours performance</p>
                        </div>
                        <div className="card-body ">
                          <div id="app" className="loader" ></div>
                          <div style={{ width: "95%", height: "500px" }}></div>
                        </div>
                        <div className="card-footer ">
                          <hr />
                          <div className="stats">
                            <i className="fa fa-history"></i> Updated 3 minutes ago
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
              </div>
                <Cards />
            </div>
          </div>
        )
}
}

export default Dashboard