
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Error404 from './components/errors/Error404'
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import EmailConfirmed from "./components/auth/EmailConfirmed"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Cookies from 'universal-cookie'



const cookies = new Cookies()


ReactDOM.render(

  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/auth/login" exact component={Login} />
        <Route path="/auth/signup" exact component={Register} />
        <Route path="/email/confirmation" exact component={EmailConfirmed} />
        <Route path="/email/confirmation/:token" exact component={EmailConfirmed} />
        <Route path="/" component={Error404} />
      </Switch>
    </Router>
  </React.StrictMode >,
  document.getElementById('root')
)



export { cookies }

