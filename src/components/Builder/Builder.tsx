import React, { FC, useRef, useEffect, memo } from 'react';
import { Pathway, State } from 'pathways-model';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import Header from 'components/Header';
import Navigation from 'components/Navigation';
import Sidebar from 'components/Sidebar';
import Graph from 'components/Graph';
import { useTheme } from 'components/ThemeProvider';

import styles from './Builder.module.scss';

interface BuilderProps {
  pathway: Pathway;
  updatePathway: (pathway: Pathway) => void;
  currentNode: State;
}

const Builder: FC<BuilderProps> = ({ pathway, updatePathway, currentNode }) => {
  const headerElement = useRef<HTMLDivElement>(null);
  const graphContainerElement = useRef<HTMLDivElement>(null);
  const theme = useTheme('dark');

  // Set the height of the graph container
  useEffect(() => {
    if (graphContainerElement?.current && headerElement?.current)
      graphContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [pathway, headerElement, graphContainerElement]);

  return (
    <>
      <div ref={headerElement}>
        <Header />
        <Navigation pathway={pathway} />
      </div>

      <div className={styles.display}>
        <MuiThemeProvider theme={theme}>
          <Sidebar
            pathway={pathway}
            updatePathway={updatePathway}
            headerElement={headerElement}
            currentNode={currentNode}
          />
        </MuiThemeProvider>

        <div ref={graphContainerElement} className={styles.graph}>
          <Graph pathway={pathway} expandCurrentNode={true} />
        </div>
      </div>
    </>
  );
};

export default memo(Builder);
