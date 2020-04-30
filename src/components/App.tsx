import React, { FC, useState, useEffect, useRef, useCallback, RefObject } from 'react';
import Header from 'components/Header';
import Navigation from 'components/Navigation';
import logo from 'camino-logo-dark.png';
import Sidebar from 'components/Sidebar';
import Graph from './Graph';
import config from 'utils/ConfigManager';
import PathwaysList from './PathwaysList';
import { PathwayProvider, usePathwayContext } from './PathwayProvider';
import ThemeProvider from './ThemeProvider';
import { Pathway, State } from 'pathways-model';
import useGetPathwaysService from './PathwaysService/PathwaysService';
import styles from './App.module.scss';
import { UserProvider } from './UserProvider';

const App: FC = () => {
  const [currentPathway, setCurrentPathway] = useState<Pathway | null>(null);
  const [selectPathway, setSelectPathway] = useState<boolean>(true);
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [user, setUser] = useState<string>('');
  const [currentNode, _setCurrentNode] = useState<State>({
    label: 'Start',
    transitions: []
  });
  const headerElement = useRef<HTMLDivElement>(null);
  const graphContainerElement = useRef<HTMLDivElement>(null);

  const service = useGetPathwaysService(config.get('demoPathwaysService'));

  const setCurrentNode = useCallback((value: State) => _setCurrentNode(value), []);

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

  return (
    <ThemeProvider>
      <UserProvider value={{ user, setUser }}>
        <PathwayProvider
          pathwayCtx={{
            pathway: currentPathway,
            setPathway: setPathwayCallback,
            currentNode,
            setCurrentNode
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
            <BuilderView
              headerElement={headerElement}
              graphContainerElement={graphContainerElement}
            />
          )}
        </PathwayProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

interface BuilderViewProps {
  headerElement: RefObject<HTMLDivElement>;
  graphContainerElement: RefObject<HTMLDivElement>;
}

const BuilderView: FC<BuilderViewProps> = ({ headerElement, graphContainerElement }) => {
  const { pathway } = usePathwayContext();
  useEffect(() => {
    console.log('ooo effects');

    return () => console.log('Builder view is unmouting now');
  });
  return (
    <div className={styles.display}>
      <Sidebar headerElement={headerElement} />

      {pathway ? (
        <div ref={graphContainerElement} className={styles.graph}>
          <Graph expandCurrentNode={true} />
        </div>
      ) : (
        <div>No Pathway Loaded</div>
      )}
    </div>
  );
};

export default App;
