import React, { FC, useState } from 'react';
import { Pathway } from 'pathways-model';
import Navigation from 'components/Navigation';
import MockedPathwayProvider from 'testUtils/MockedPathwayProvider';
import { loadedService } from './services';

const MockedNavigation: FC = () => {
  let defaultList: Pathway[] = [];
  if (loadedService.status === 'loaded') {
    defaultList = loadedService.payload;
  }

  const [currentPathway, setCurrentPathway] = useState<Pathway | null>(null);
  const [pathways, setPathways] = useState<Pathway[]>(defaultList);

  function setPathwayCallback(value: Pathway | null): void {
    if (value !== null) setCurrentPathway(value);
  }

  function updatePathways(value: Pathway): void {
    const newList = [...pathways]; // Create a shallow copy of list
    for (let i = 0; i < pathways.length; i++) {
      if (pathways[i].name === value.name) {
        newList[i] = value;
        setPathways(newList);
      }
    }
  }

  return (
    <MockedPathwayProvider
      pathwayCtx={{
        pathway: currentPathway,
        setPathway: setPathwayCallback,
        updatePathways: updatePathways
      }}
    >
      <Navigation />
    </MockedPathwayProvider>
  );
};

export default MockedNavigation;
