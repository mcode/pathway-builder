import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import App from './components/App.tsx';
import './styles/index.scss';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" render={() => <App />}></Route>
    </Switch>
  </Router>,
  rootElement
);