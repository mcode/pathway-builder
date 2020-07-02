import React, { FC, memo } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Header from 'components/Header';

import BuilderRoute from './BuilderRoute';
import ThemeProvider from './ThemeProvider';
import { PathwayProvider } from './PathwayProvider';
import { UserProvider } from './UserProvider';
import { CriteriaProvider } from './CriteriaProvider';
import Tabs from './Tabs';
import PathwaysList from './PathwaysList';
import CriteriaList from './CriteriaList';
import { CurrentPathwayProvider } from './CurrentPathwayProvider';
import { CurrentNodeProvider } from './CurrentNodeProvider';

const App: FC = () => {
  return (
    <ThemeProvider theme="light">
      <UserProvider>
        <CurrentPathwayProvider>
          <PathwayProvider>
            <CurrentNodeProvider>
              <CriteriaProvider>
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
                          { label: 'Criteria', component: <CriteriaList /> }
                        ]}
                      />
                    </Route>
                  </Switch>
                </Router>
              </CriteriaProvider>
            </CurrentNodeProvider>
          </PathwayProvider>
        </CurrentPathwayProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default memo(App);
