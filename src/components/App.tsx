import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { EvaluatedPathway } from 'pathways-model';

import useGetPathwaysService from './PathwaysService/PathwaysService';
import { UserProvider } from './UserProvider';
import { PathwayProvider } from './PathwayProvider';
import ThemeProvider from './ThemeProvider';
import config from 'utils/ConfigManager';

import PathwaysList from './PathwaysList';
import Graph from './Graph';
import PatientRecord from './PatientRecord/PatientRecord';
import Header from 'components/Header';

import logo from 'camino-builder-logo-dark-bg.png';
import styles from './App.module.scss';

interface AppProps {}

const App: FC<AppProps> = () => {
  const [currentPathway, setCurrentPathway] = useState<EvaluatedPathway | null>(
    null
  );
  const [selectPathway, setSelectPathway] = useState<boolean>(true);
  const [evaluatedPathways, setEvaluatedPathways] = useState<
    EvaluatedPathway[]
  >([]);
  const [user, setUser] = useState<string>('');
  const headerElement = useRef<HTMLDivElement>(null);
  const graphContainerElement = useRef<HTMLDivElement>(null);

  const service = useGetPathwaysService(config.get('demoPathwaysService'));

  useEffect(() => {
    if (service.status === 'loaded' && evaluatedPathways.length === 0)
      setEvaluatedPathways(
        service.payload.map((pathway) => ({
          pathway: pathway,
          pathwayResults: null,
        }))
      );
  }, [service, evaluatedPathways.length]);

  // Set the height of the graph container
  useEffect(() => {
    if (graphContainerElement?.current && headerElement?.current)
      graphContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [selectPathway]);

  function setEvaluatedPathwayCallback(
    value: EvaluatedPathway | null,
    selectPathway = false
  ): void {
    window.scrollTo(0, 0);
    setSelectPathway(selectPathway);
    setCurrentPathway(value);
  }

  const updateEvaluatedPathways = useCallback(
    (value: EvaluatedPathway) => {
      const newList = [...evaluatedPathways]; // Create a shallow copy of list
      for (let i = 0; i < evaluatedPathways.length; i++) {
        if (evaluatedPathways[i].pathway.name === value.pathway.name) {
          newList[i] = value;
          setEvaluatedPathways(newList);
        }
      }

      if (currentPathway?.pathway.name === value.pathway.name) {
        setCurrentPathway(value);
      }
    },
    [currentPathway, evaluatedPathways]
  );

  interface PatientViewProps {
    evaluatedPathway: EvaluatedPathway | null;
  }

  const PatientView: FC<PatientViewProps> = ({ evaluatedPathway }) => {
    return (
      <div className={styles.display}>
        <PatientRecord headerElement={headerElement} />

        {evaluatedPathway ? (
          <div ref={graphContainerElement} className={styles.graph}>
            <Graph
              evaluatedPathway={evaluatedPathway}
              expandCurrentNode={true}
              updateEvaluatedPathways={updateEvaluatedPathways}
            />
          </div>
        ) : (
          <div>No Pathway Loaded</div>
        )}
      </div>
    );
  };

  return (
    <ThemeProvider>
      <UserProvider value={{ user, setUser }}>
        <PathwayProvider
          pathwayCtx={{
            updateEvaluatedPathways,
            evaluatedPathway: currentPathway,
            setEvaluatedPathway: setEvaluatedPathwayCallback,
          }}
        >
          <div ref={headerElement}>
            <Header logo={logo} />
          </div>

          {selectPathway ? (
            <PathwaysList
              evaluatedPathways={evaluatedPathways}
              callback={setEvaluatedPathwayCallback}
              service={service}
            ></PathwaysList>
          ) : (
            <PatientView evaluatedPathway={currentPathway} />
          )}
        </PathwayProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
