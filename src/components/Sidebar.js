import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
class Sidebar extends Component {
    componentDidMount() {
    }

    render() {
        return(

            <div className="sidebar" data-color="purple">
            <div className="sidebar-wrapper">
              <div className="logo">
                <Link to='/' className="simple-text">
                  Cloud Computing Project
                </Link>
              </div>
              <ul className="nav">
                <li className="nav-item">
                  <NavLink className="nav-link" to='/'>
                    <i className="nc-icon nc-chart-pie-35"></i>
                    <p>Dashboard</p>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

        ) 
    }
}

export default Sidebar