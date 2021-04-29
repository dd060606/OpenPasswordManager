import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Error404 from './components/errors/Error404';
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"


import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { setLang } from "./utils/langManager"

import Cookies from 'universal-cookie';
const cookies = new Cookies();
let language = ""

let navigatorLanguage = navigator.language || navigator.userLanguage
language = navigatorLanguage.substring(0, 2).toLowerCase()
if (language !== "fr") {
  language = "en"
}


updateLanguage()

function updateRender() {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/Login" exact component={Login} />
          <Route path="/Register" exact component={Register} />
          <Route path="/" component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode >,
    document.getElementById('root')
  );
}

function updateLanguage() {
  fetch('assets/langs/' + language + '.json', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

  })
    .then(res => res.json())
    .then(json => {
      setLang(json)
      updateRender()
    })
}

export { updateRender, cookies, updateLanguage }
