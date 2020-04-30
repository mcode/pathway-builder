import React, { FC, useState } from 'react';
import { Pathway } from 'pathways-model';
import Navigation from 'components/Navigation';
import MockedPathwayProvider from 'testUtils/MockedPathwayProvider';

const MockedNavigation: FC = () => {
  const [currentPathway, setCurrentPathway] = useState<Pathway | null>(null);

  function setPathwayCallback(value: Pathway | null): void {
    if (value !== null) setCurrentPathway(value);
  }

  return (
    <MockedPathwayProvider
      pathwayCtx={{
        pathway: currentPathway,
        setPathway: setPathwayCallback
      }}
    >
      <Navigation />
    </MockedPathwayProvider>
  );
};

export default MockedNavigation;
