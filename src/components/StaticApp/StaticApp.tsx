import React, { FC, memo } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Header from 'components/StaticApp/Header';
import BuilderRoute from './BuilderRoute';
import ThemeProvider from 'components/ThemeProvider';
import { PathwaysProvider } from './PathwaysProvider';
import { UserProvider } from 'components/UserProvider';
import { CriteriaProvider } from './CriteriaProvider';
import Tabs from 'components/Tabs';
import PathwaysList from './PathwaysList';
import CriteriaList from './CriteriaList';
import { CurrentPathwayProvider } from './CurrentPathwayProvider';
import { CurrentNodeProvider } from 'components/CurrentNodeProvider';
import { CurrentCriteriaProvider } from 'components/CurrentCriteriaProvider';
import { SnackbarProvider } from 'components/SnackbarProvider';
import { CriteriaBuilderProvider } from 'components/CriteriaBuilderProvider';

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
