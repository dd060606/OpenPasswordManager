import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/Home';
import Downloads from './components/Downloads';
import Error404 from './components/errors/Error404';
import Footer from "./components/Footer"


import Navigation from "./nav/Navigation"
import reportWebVitals from './reportWebVitals';
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
        <Navigation />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Downloads" exact component={Downloads} />
          <Route path="/" component={Error404} />
        </Switch>
        <Footer />
      </Router>
    </React.StrictMode >,
    document.getElementById('root')
  );
}

export { updateRender, cookies }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
