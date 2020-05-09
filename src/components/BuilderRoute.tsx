import React, { FC, memo, useMemo } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import Builder from 'components/Builder';
import { usePathwayContext } from 'components/PathwayProvider';

const BuilderRoute: FC = () => {
  const { id, nodeId } = useParams();
  const { pathways } = usePathwayContext();
  const pathwayId = decodeURIComponent(id);
  const pathway = useMemo(() => pathways.find(pathway => pathway.id === pathwayId), [
    pathwayId,
    pathways
  ]);
  const currentNode = pathway?.states?.[decodeURIComponent(nodeId)];

  if (pathway != null && currentNode == null) {
    return <Redirect to={`/builder/${id}/node/Start`} />;
  }

  return <Builder pathway={pathway} currentNode={currentNode} />;
};

export default memo(BuilderRoute);
