import React, { FC, memo, ReactNode } from 'react';
import { Tab as ReactTab, TabList, TabPanel, Tabs as ReactTabs } from 'react-tabs';

import { Button } from '@material-ui/core';

import useStyles from './styles';
import shortid from 'shortid';

interface Tab {
  label: string;
  component: ReactNode;
}

interface TabsProp {
  tabs: Tab[];
}

const Tabs: FC<TabsProp> = ({ tabs }) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <ReactTabs>
        <TabList>
          {tabs.map(tab => (
            <ReactTab key={shortid.generate()}>
              <Button classes={{ label: styles.label }}>{tab.label}</Button>
            </ReactTab>
          ))}
        </TabList>

        {tabs.map(tab => (
          <TabPanel key={shortid.generate()}>{tab.component}</TabPanel>
        ))}
      </ReactTabs>
    </div>
  );
};

export default memo(Tabs);
