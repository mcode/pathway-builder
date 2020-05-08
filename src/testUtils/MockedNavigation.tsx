import React, { FC, useState } from 'react';
import { Pathway, State } from 'pathways-model';
import Navigation from 'components/Navigation';
import MockedPathwayProvider from 'testUtils/MockedPathwayProvider';

const MockedNavigation: FC = () => {
  const [currentPathway, setCurrentPathway] = useState<Pathway | null>(null);
  const [currentNode, setCurrentNode] = useState<State>({
    label: 'Start',
    transitions: []
  });

  function setPathwayCallback(value: Pathway | null): void {
    if (value !== null) setCurrentPathway(value);
  }

  return (
    <MockedPathwayProvider
      pathwayCtx={{
        pathway: currentPathway,
        setPathway: setPathwayCallback,
        currentNode: currentNode,
        setCurrentNode: setCurrentNode
      }}
    >
      <Navigation />
    </MockedPathwayProvider>
  );
};

export default MockedNavigation;
