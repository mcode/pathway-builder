import React, { FC, useRef, useEffect, memo, useState, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';

import Header from 'components/Header';
import Navigation from 'components/Navigation';
import Sidebar from 'components/Sidebar';
import Graph from 'components/Graph';
import CriteriaBuilder from 'components/CriteriaBuilder';
import { useTheme } from 'components/ThemeProvider';
import useStyles from './styles';
import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

const Builder: FC = () => {
  const styles = useStyles();
  const { pathway } = useCurrentPathwayContext();
  const { currentCriteriaNodeId } = useCurrentCriteriaContext();
  const headerElement = useRef<HTMLDivElement>(null);
  const theme = useTheme('dark');
  const [showCriteriaBuilder, setShowCriteriaBuilder] = useState<boolean>(true);
  const [graphContainerElement, setGraphContainerElement] = useState<HTMLDivElement | null>(null);
  const [graphContainerWidth, setGraphContainerWidth] = useState<number>(0);

  const toggleShowCriteria = useCallback((): void => {
    setShowCriteriaBuilder(!showCriteriaBuilder);
  }, [showCriteriaBuilder]);

  const handleGraphContainerElement = useCallback((reactNode: HTMLDivElement) => {
    setGraphContainerElement(reactNode);
    if (reactNode) {
      setGraphContainerWidth(reactNode.clientWidth);
    }
  }, []);

  // Recalculate graph layout if graph container size changes
  useEffect(() => {
    if (graphContainerElement) {
      new ResizeSensor(graphContainerElement, function() {
        setGraphContainerWidth(graphContainerElement.clientWidth);
      });
    }
  }, [graphContainerElement]);

  // Set the height of the graph container
  useEffect(() => {
    const resize = (): void => {
      if (graphContainerElement && headerElement?.current)
        graphContainerElement.style.height =
          window.innerHeight - headerElement.current.clientHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);
    return (): void => window.removeEventListener('resize', resize);
  }, [pathway, headerElement, graphContainerElement]);

  // Reset criteriaBuilderToggle to true if not currently building criteria
  useEffect(() => {
    if (!showCriteriaBuilder && currentCriteriaNodeId === '') setShowCriteriaBuilder(true);
  }, [currentCriteriaNodeId, showCriteriaBuilder]);

  return (
    <>
      <div ref={headerElement}>
        <Header />
        <Navigation />
      </div>

      {pathway && (
        <div className={styles.display}>
          <MuiThemeProvider theme={theme}>
            <Sidebar headerElement={headerElement} />
          </MuiThemeProvider>

          <div ref={handleGraphContainerElement} className={styles.graph}>
            {currentCriteriaNodeId !== '' && (
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
            {currentCriteriaNodeId !== '' && showCriteriaBuilder ? (
              <CriteriaBuilder />
            ) : (
              <Graph graphContainerWidth={graphContainerWidth} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Builder);
