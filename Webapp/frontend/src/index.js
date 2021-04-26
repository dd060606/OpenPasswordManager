import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Error404 from './components/errors/Error404';
import Login from "./components/auth/Login"

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { setLanguage, setLangJSON } from "./utils/langManager"

import Cookies from 'universal-cookie';
const cookies = new Cookies();


if (cookies.get("language") === undefined) {
  cookies.set('language', 'en', { path: '/' });
}

fetch('assets/langs/' + cookies.get("language") + '.json', {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

})
  .then(res => res.json())
  .then(json => {
    setLangJSON(json)
    setLanguage(cookies.get("language"))
    updateRender()
  })

function updateRender() {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/" component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode >,
    document.getElementById('root')
  );
}

export { updateRender, cookies }
