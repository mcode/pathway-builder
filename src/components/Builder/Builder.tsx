import React, { FC, useRef, useEffect, memo, useState, useCallback } from 'react';
import { Pathway, State } from 'pathways-model';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { useCriteriaContext } from 'components/CriteriaProvider';

import Header from 'components/Header';
import Navigation from 'components/Navigation';
import Sidebar from 'components/Sidebar';
import Graph from 'components/Graph';
import { useTheme } from 'components/ThemeProvider';

import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import useStyles from './styles';

interface BuilderProps {
  pathway: Pathway;
  currentNode: State;
}

const Builder: FC<BuilderProps> = ({ pathway, currentNode }) => {
  const styles = useStyles();
  const { buildCriteria } = useCriteriaContext();
  const headerElement = useRef<HTMLDivElement>(null);
  const graphContainerElement = useRef<HTMLDivElement>(null);
  const theme = useTheme('dark');
  const [criteriaBuilderToggle, setCriteriaBuilderToggle] = useState<boolean>(true);

  const handleToggle = useCallback((): void => {
    setCriteriaBuilderToggle(!criteriaBuilderToggle);
  }, [criteriaBuilderToggle]);

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
          <Sidebar pathway={pathway} headerElement={headerElement} currentNode={currentNode} />
        </MuiThemeProvider>

        <div ref={graphContainerElement} className={styles.graph}>
          <div className={styles.graphHeader}>
            {buildCriteria && (
              <>
                <div className={styles.graphHeaderText}>
                  <span>Criteria Builder</span>
                </div>
                <IconButton className={styles.toggleButton} onClick={handleToggle}>
                  <FontAwesomeIcon icon={criteriaBuilderToggle ? faToggleOn : faToggleOff} />
                </IconButton>
              </>
            )}
          </div>
          {buildCriteria && criteriaBuilderToggle ? (
            // Empty section for authoring tool
            <div />
          ) : (
            <Graph pathway={pathway} expandCurrentNode={true} currentNode={currentNode} />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Builder);
