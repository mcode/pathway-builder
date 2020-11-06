import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import App from 'components/App';
import { Landing } from 'components/Auth';
import ThemeProvider from 'components/ThemeProvider';

import './styles/index.scss';
import StaticApp from 'components/StaticApp';
import { AuthModalProvider } from 'components/Auth/AuthModalProvider';

// Enable why did you render for development mode
// Will automatically track all memoized components
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true
  });
}

ReactDOM.render(
  <ThemeProvider theme="light">
    <AuthModalProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/builder" component={App} />
          <Route path="/demo" component={StaticApp} />
        </Switch>
      </Router>
    </AuthModalProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
