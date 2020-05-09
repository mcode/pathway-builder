import React, { FC, memo } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Header from 'components/Header';
import PathwaysList from 'components/PathwaysList';

import BuilderRoute from './BuilderRoute';
import ThemeProvider from './ThemeProvider';
import { PathwayProvider } from './PathwayProvider';
import { UserProvider } from './UserProvider';

const App: FC = () => {
  return (
    <ThemeProvider theme="light">
      <UserProvider>
        <PathwayProvider>
          <Router>
            <Switch>
              <Route path="/builder/:id/node/:nodeId">
                <BuilderRoute />
              </Route>
              <Route path="/builder/:id">
                <BuilderRoute />
              </Route>
              <Route path="/">
                <Header />
                <PathwaysList />
              </Route>
            </Switch>
          </Router>
        </PathwayProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default memo(App);
