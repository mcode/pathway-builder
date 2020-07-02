import React, { FC, memo, useMemo } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import Builder from 'components/Builder';
import { usePathwayContext } from 'components/PathwayProvider';

const BuilderRoute: FC = () => {
  const { id, nodeId } = useParams();
  const { pathways } = usePathwayContext();
  const pathwayId = decodeURIComponent(id);
  const pathwayIndex = useMemo(() => pathways.findIndex(pathway => pathway.id === pathwayId), [
    pathwayId,
    pathways
  ]);
  const pathway = pathways[pathwayIndex];
  const currentNode = pathway?.states?.[decodeURIComponent(nodeId)];

  if (pathway == null) return null;
  if (currentNode == null) return <Redirect to={`/builder/${id}/node/Start`} />;

  return <Builder pathway={pathway} currentNode={currentNode} />;
};

export default memo(BuilderRoute);
