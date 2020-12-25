import React, { Component } from 'react'

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg " color-on-scroll="500">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">COVID-19 Dashboard</a>
              <div className="collapse navbar-collapse justify-content-end" id="navigation">
              </div>
            </div>
          </nav>

        )
    }
}

export default Navbar