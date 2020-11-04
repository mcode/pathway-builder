import React, { FC, memo } from 'react';

import GraphEdges from 'components/DagreGraph/GraphEdges';
import GraphProvider from 'components/DagreGraph/GraphProvider';
import GraphNodes from './GraphNodes';
import GraphRoot from 'components/DagreGraph/GraphRoot';

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
