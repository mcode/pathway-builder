import React, { FC, memo } from 'react';

import GraphEdges from './GraphEdges';
import GraphProvider from './GraphProvider';
import GraphNodes from './GraphNodes';
import GraphRoot from './GraphRoot';
import { PathwayNode } from 'pathways-model';

interface DagreGraphProps {
  interactive?: boolean;
  currentNode: PathwayNode | null;
}

const DagreGraph: FC<DagreGraphProps> = ({ interactive = true, currentNode }) => {
  return (
    <GraphProvider>
      <GraphRoot>
        <GraphNodes interactive={interactive} currentNode={currentNode} />
        <GraphEdges currentNode={currentNode} />
      </GraphRoot>
    </GraphProvider>
  );
};

export default memo(DagreGraph);
