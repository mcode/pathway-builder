import React, { FC, memo } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import Header from 'components/Header';
import PathwaysList from 'components/PathwaysList';
import CriteriaList from 'components/CriteriaList';

import BuilderRoute from './BuilderRoute';
import ThemeProvider from './ThemeProvider';
import { PathwayProvider } from './PathwayProvider';
import { UserProvider } from './UserProvider';
import { CriteriaProvider } from './CriteriaProvider';
import { Button, makeStyles, Theme, createStyles } from '@material-ui/core';

const App: FC = () => {
  return (
    <ThemeProvider theme="light">
      <UserProvider>
        <PathwayProvider>
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
                  <PathwayCriteriaTabs />
                </Route>
              </Switch>
            </Router>
          </CriteriaProvider>
        </PathwayProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

const PathwayCriteriaTabs: FC = () => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      label: {
        padding: `0.2em 2em`,
        textTransform: 'none',
        fontSize: '1.2em',
        fontWeight: 100
      }
    })
  );
  const styles = useStyles();

  return (
    <Tabs>
      <TabList>
        <Tab>
          <Button classes={{ label: styles.label }}>Pathways</Button>
        </Tab>
        <Tab>
          <Button classes={{ label: styles.label }}>Criteria</Button>
        </Tab>
      </TabList>

      <TabPanel>
        <PathwaysList />
      </TabPanel>
      <TabPanel>
        <CriteriaList />
      </TabPanel>
    </Tabs>
  );
};

export default memo(App);
