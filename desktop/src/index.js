
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import "./fontawesome.css"

import Error404 from './components/Error404'
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import App from "./components/App"
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import PasswordsDashboard from './components/dashboards/PasswordsDashboard'
import AccountDashboard from "./components/dashboards/AccountDashboard"
import GeneratorDashboard from './components/dashboards/GeneratorDashboard'
import SettingsDashboard from './components/dashboards/SettingsDashboard'
import Updater from './components/Updater'





ReactDOM.render(

  <React.StrictMode>

    <Router>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/updater" exact component={Updater} />
        <Route path="/auth/login" exact component={Login} />
        <Route path="/auth/signup" exact component={Register} />
        <Route path="/dashboard/passwords" exact component={PasswordsDashboard} />
        <Route path="/dashboard/my-account" exact component={AccountDashboard} />
        <Route path="/dashboard/generator" exact component={GeneratorDashboard} />
        <Route path="/dashboard/settings" exact component={SettingsDashboard} />
        <Route path="/" component={Error404} />
      </Switch>
    </Router>
  </React.StrictMode >,
  document.getElementById('root')
)


