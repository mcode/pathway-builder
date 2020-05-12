import React, { FC, useRef, useEffect, memo } from 'react';
import { Pathway, State } from 'pathways-model';

import Header from 'components/Header';
import Navigation from 'components/Navigation';
import Sidebar from 'components/Sidebar';
import Graph from 'components/Graph';

import styles from './Builder.module.scss';

interface BuilderProps {
  pathway: Pathway;
  currentNode?: State | null;
}

const Builder: FC<BuilderProps> = ({ pathway, currentNode }) => {
  const headerElement = useRef<HTMLDivElement>(null);
  const graphContainerElement = useRef<HTMLDivElement>(null);

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
        <Sidebar headerElement={headerElement} currentNode={currentNode} />

        <div ref={graphContainerElement} className={styles.graph}>
          <Graph pathway={pathway} expandCurrentNode={true} />
        </div>
      </div>
    </>
  );
};

export default memo(Builder);
