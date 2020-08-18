import React, { FC, memo } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Header from 'components/Header';

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
import { BuildCriteriaProvider } from './BuildCriteriaProvider';
import { SnackbarProvider } from './SnackbarProvider';
import { CriteriaBuilderStateProvider } from './CriteriaBuilderStateProvider';

const App: FC = () => {
  return (
    <ThemeProvider theme="light">
      <UserProvider>
        <CurrentPathwayProvider>
          <PathwaysProvider>
            <CurrentNodeProvider>
              <CriteriaProvider>
                <SnackbarProvider>
                  <BuildCriteriaProvider>
                    <CriteriaBuilderStateProvider>
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
                    </CriteriaBuilderStateProvider>
                  </BuildCriteriaProvider>
                </SnackbarProvider>
              </CriteriaProvider>
            </CurrentNodeProvider>
          </PathwaysProvider>
        </CurrentPathwayProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default memo(App);
