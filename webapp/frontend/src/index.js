import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Error404 from './components/errors/Error404';
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"


import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { setLang, language, init as initLanguage } from "./utils/langs"


import Cookies from 'universal-cookie';
const cookies = new Cookies();


initLanguage()
updateLanguage()

function updateRender() {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Register} />
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

export { updateRender, cookies }
