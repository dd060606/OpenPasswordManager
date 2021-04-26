import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Error404 from './components/errors/Error404';
import Login from "./components/auth/Login"

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { setLanguage, setLangJSON } from "./utils/langManager"
import Swal from 'sweetalert2'

import Cookies from 'universal-cookie';
const cookies = new Cookies();


if (cookies.get("language") === undefined) {
  cookies.set('language', 'en', { path: '/' })
  Swal.fire({
    title: 'Please select a language',
    input: 'select',
    inputOptions: {
      english: "English",
      french: "Français"
    },
    inputPlaceholder: 'Select a language',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value === "english" || value === "french") {
          cookies.set("language", value.substring(0, 2).toLowerCase(), { path: '/' })
          updateLanguage()
          resolve()
        }
      })
    }
  })
}

updateLanguage()

function updateRender() {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/Login" exact component={Login} />
          <Route path="/" component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode >,
    document.getElementById('root')
  );
}

function updateLanguage() {
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
}

export { updateRender, cookies, updateLanguage }
