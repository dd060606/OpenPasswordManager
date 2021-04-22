import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Navigation from "./nav/Navigation"
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { setLanguage } from "./utils/langManager"


setLanguage("en")
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Navigation />

      <Route path="/" exact component={Home} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
