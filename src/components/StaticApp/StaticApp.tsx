import React, { FC, memo } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Header from 'components/StaticApp/Header';

import BuilderRoute from './BuilderRoute';
import ThemeProvider from './ThemeProvider';
import { PathwaysProvider } from './PathwaysProvider';
import { UserProvider } from './UserProvider';
import { CriteriaProvider } from './CriteriaProvider';
import Tabs from './Tabs';
import PathwaysList from './PathwaysList';
import CriteriaList from './CriteriaList';
import { CurrentPathwayProvider } from './CurrentPathwayProvider';
import { CurrentNodeProvider } from './CurrentNodeProvider';
import { CurrentCriteriaProvider } from './CurrentCriteriaProvider';
import { SnackbarProvider } from './SnackbarProvider';
import { CriteriaBuilderProvider } from './CriteriaBuilderProvider';

const StaticApp: FC = () => {
  return (
    <ThemeProvider theme="light">
      <UserProvider>
        <CriteriaProvider>
          <PathwaysProvider>
            <CurrentNodeProvider>
              <CurrentPathwayProvider>
                <SnackbarProvider>
                  <CurrentCriteriaProvider>
                    <CriteriaBuilderProvider>
                      <Router>
                        <Switch>
                          <Route path="/demo/builder/:id/node/:nodeId">
                            <BuilderRoute />
                          </Route>
                          <Route path="/demo/builder/:id">
                            <BuilderRoute />
                          </Route>
                          <Route path="/demo">
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
                    </CriteriaBuilderProvider>
                  </CurrentCriteriaProvider>
                </SnackbarProvider>
              </CurrentPathwayProvider>
            </CurrentNodeProvider>
          </PathwaysProvider>
        </CriteriaProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default memo(StaticApp);
