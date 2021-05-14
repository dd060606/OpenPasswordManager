
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Error404 from './components/errors/Error404'
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import EmailConfirmed from "./components/auth/EmailConfirmed"
import App from "./components/App"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Cookies from 'universal-cookie'
import Dashboard from './components/dashboard/Dashboard';



const cookies = new Cookies()



ReactDOM.render(

  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/auth/login" exact component={Login} />
        <Route path="/auth/signup" exact component={Register} />
        <Route path="/auth/email/confirmation" exact component={EmailConfirmed} />
        <Route path="/auth/email/confirmation/:token" exact component={EmailConfirmed} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/" component={Error404} />
      </Switch>
    </Router>
  </React.StrictMode >,
  document.getElementById('root')
)



export { cookies }

