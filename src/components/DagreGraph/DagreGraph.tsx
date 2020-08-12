import React, { FC, memo } from 'react';

import GraphEdges from './GraphEdges';
import GraphProvider from './GraphProvider';
import GraphNodes from './GraphNodes';
import GraphRoot from './GraphRoot';

interface DagreGraphProps {
  interactive?: boolean;
}

const DagreGraph: FC<DagreGraphProps> = ({ interactive = true }) => {
  return (
    <GraphProvider>
      <GraphRoot>
        <GraphNodes interactive={interactive} />
        <GraphEdges />
      </GraphRoot>
    </GraphProvider>
  );
};

export default memo(DagreGraph);
