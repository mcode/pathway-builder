import React, { FC, useState, useEffect, useRef } from 'react';
import Header from 'components/Header';
import Navigation from 'components/Navigation';
import logo from 'camino-logo-dark.png';
import Sidebar from 'components/Sidebar';
import Graph from './Graph';
import config from 'utils/ConfigManager';
import PathwaysList from './PathwaysList';
import { PathwayProvider } from './PathwayProvider';
import ThemeProvider from './ThemeProvider';
import { Pathway } from 'pathways-model';
import useGetPathwaysService from './PathwaysService/PathwaysService';
import styles from './App.module.scss';
import { UserProvider } from './UserProvider';

const App: FC = () => {
  const [currentPathway, setCurrentPathway] = useState<Pathway | null>(null);
  const [selectPathway, setSelectPathway] = useState<boolean>(true);
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [user, setUser] = useState<string>('');
  const headerElement = useRef<HTMLDivElement>(null);
  const graphContainerElement = useRef<HTMLDivElement>(null);

  const service = useGetPathwaysService(config.get('demoPathwaysService'));

  useEffect(() => {
    if (service.status === 'loaded' && pathways.length === 0) setPathways(service.payload);
  }, [service, pathways.length]);

  // Set the height of the graph container
  useEffect(() => {
    if (graphContainerElement?.current && headerElement?.current)
      graphContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [selectPathway]);

  function setPathwayCallback(value: Pathway | null, selectPathway = false): void {
    window.scrollTo(0, 0);
    setSelectPathway(selectPathway);
    setCurrentPathway(value);
  }

  interface PatientViewProps {
    pathway: Pathway | null;
  }

  const BuilderView: FC<PatientViewProps> = ({ pathway }) => {
    return (
      <div className={styles.display}>
        <Sidebar headerElement={headerElement} />

        {pathway ? (
          <div ref={graphContainerElement} className={styles.graph}>
            <Graph pathway={pathway} expandCurrentNode={true} />
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
            pathway: currentPathway,
            setPathway: setPathwayCallback
          }}
        >
          <div ref={headerElement}>
            <Header logo={logo} />

            <Navigation name={currentPathway?.name ?? ''} />
          </div>

          {selectPathway ? (
            <PathwaysList
              pathways={pathways}
              callback={setPathwayCallback}
              service={service}
            ></PathwaysList>
          ) : (
            <BuilderView pathway={currentPathway} />
          )}
        </PathwayProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
