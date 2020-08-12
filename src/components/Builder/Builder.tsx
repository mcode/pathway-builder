import React, { FC, useEffect, memo, useState, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';

import Header from 'components/Header';
import Navigation from 'components/Navigation';
import Sidebar from 'components/Sidebar';
import DagreGraph from 'components/DagreGraph';
import CriteriaBuilder from 'components/CriteriaBuilder';
import { useTheme } from 'components/ThemeProvider';
import useStyles from './styles';
import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';

const Builder: FC = () => {
  const styles = useStyles();
  const { pathway } = useCurrentPathwayContext();
  const { currentCriteriaNodeId } = useCurrentCriteriaContext();
  const theme = useTheme('dark');
  const [showCriteriaBuilder, setShowCriteriaBuilder] = useState<boolean>(true);

  const toggleShowCriteria = useCallback((): void => {
    setShowCriteriaBuilder(!showCriteriaBuilder);
  }, [showCriteriaBuilder]);

  // Reset criteriaBuilderToggle to true if not currently building criteria
  useEffect(() => {
    if (!showCriteriaBuilder && currentCriteriaNodeId === '') setShowCriteriaBuilder(true);
  }, [currentCriteriaNodeId, showCriteriaBuilder]);

  return (
    <div className={styles.root}>
      <div>
        <Header />
        <Navigation />
      </div>

      {pathway && (
        <div className={styles.main}>
          <MuiThemeProvider theme={theme}>
            <Sidebar />
          </MuiThemeProvider>

          <div className={styles.graph}>
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
              <DagreGraph />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Builder);
