import React, { FC, useRef, useEffect, memo, useState, useCallback } from 'react';
import { Pathway, PathwayNode } from 'pathways-model';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { useCriteriaContext } from 'components/CriteriaProvider';

import Header from 'components/Header';
import Navigation from 'components/Navigation';
import Sidebar from 'components/Sidebar';
import Graph from 'components/Graph';
import { useTheme } from 'components/ThemeProvider';

import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import useStyles from './styles';

interface BuilderProps {
  pathway: Pathway;
  updatePathway: (pathway: Pathway) => void;
  currentNode: PathwayNode;
}

const Builder: FC<BuilderProps> = ({ pathway, currentNode }) => {
  const styles = useStyles();
  const { buildCriteriaNodeId } = useCriteriaContext();
  const headerElement = useRef<HTMLDivElement>(null);
  const graphContainerElement = useRef<HTMLDivElement>(null);
  const theme = useTheme('dark');
  const [showCriteriaBuilder, setShowCriteriaBuilder] = useState<boolean>(true);

  const toggleShowCriteria = useCallback((): void => {
    setShowCriteriaBuilder(!showCriteriaBuilder);
  }, [showCriteriaBuilder]);

  // Set the height of the graph container
  useEffect(() => {
    if (graphContainerElement?.current && headerElement?.current)
      graphContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [pathway, headerElement, graphContainerElement]);

  // Reset criteriaBuilderToggle to true if not currently building criteria
  useEffect(() => {
    if (!showCriteriaBuilder && buildCriteriaNodeId === '') setShowCriteriaBuilder(true);
  }, [buildCriteriaNodeId, showCriteriaBuilder]);

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
          {buildCriteriaNodeId !== '' && (
            <div className={styles.graphHeader}>
              <div className={styles.graphHeaderText}>
                <span>Criteria Builder</span>
              </div>
              <IconButton
                className={`${styles.toggleButton}-${showCriteriaBuilder ? 'on' : 'off'}`}
                onClick={toggleShowCriteria}
              >
                <FontAwesomeIcon className={styles.toggleIcon} icon={faProjectDiagram} />
              </IconButton>
            </div>
          )}
          {buildCriteriaNodeId !== '' && showCriteriaBuilder ? (
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
