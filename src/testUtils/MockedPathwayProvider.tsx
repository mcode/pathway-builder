import React, { FC, ReactNode } from 'react';
import { PathwayContext } from 'components/PathwayProvider';
import { PathwayContextInterface, Pathway, State } from 'pathways-model';

interface PathwayProviderProps {
  children: ReactNode;
  pathwayCtx: PathwayContextInterface;
}

const pathway: Pathway = {
  name: 'Test Pathway',
  library: 'mCODE.cql',
  criteria: [
    {
      elementName: 'condition',
      expected: 'breast cancer',
      cql: 'some fancy CQL statement'
    }
  ],
  states: {
    Start: {
      label: 'Start',
      transitions: []
    }
  }
};

const currentNode: State = {
  label: 'Start',
  transitions: []
};

export const mockedPathwayCtx = {
  pathway,
  setPathway: (): void => {
    //do nothing
  },
  currentNode,
  setCurrentNode: (): void => {
    //do nothing
  }
};

const MockedPathwayProvider: FC<PathwayProviderProps> = ({ pathwayCtx = null, children }) => (
  <PathwayContext.Provider value={pathwayCtx || mockedPathwayCtx}>
    {children}
  </PathwayContext.Provider>
);

export default MockedPathwayProvider;
