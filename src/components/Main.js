import React, { Component } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard'

class Main extends Component {
    render() {
        return (

            <div className="main-panel">
            <Navbar />
            <Switch>
              <Route path="/" component={Dashboard} />
              <Redirect from='*' to='/' />
            </Switch>
            <Footer />
          </div>
        )
    }
}

export default Main