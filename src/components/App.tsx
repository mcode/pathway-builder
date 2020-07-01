import React, { FC, memo } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Header from 'components/Header';

import BuilderRoute from './BuilderRoute';
import ThemeProvider from './ThemeProvider';
import { PathwayProvider } from './PathwayProvider';
import { UserProvider } from './UserProvider';
import { PreconditionProvider } from './PreconditionProvider';
import Tabs from './Tabs';
import PathwaysList from './PathwaysList';
import PreconditionList from './PreconditionList';

const App: FC = () => {
  return (
    <ThemeProvider theme="light">
      <UserProvider>
        <PathwayProvider>
          <PreconditionProvider>
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
                  <Tabs
                    tabs={[
                      { label: 'Pathway', component: <PathwaysList /> },
                      { label: 'Precondition', component: <PreconditionList /> }
                    ]}
                  />
                </Route>
              </Switch>
            </Router>
          </PreconditionProvider>
        </PathwayProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default memo(App);
