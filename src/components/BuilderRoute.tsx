import React, { FC, memo, useMemo, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import Builder from 'components/Builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
import { useCurrentPathwayContext } from './CurrentPathwayProvider';
import { useCurrentNodeContext } from './CurrentNodeProvider';

const BuilderRoute: FC = () => {
  const { id, nodeId } = useParams();
  const { pathways } = usePathwaysContext();
  const { pathwayRef, setPathway, resetPathway } = useCurrentPathwayContext();
  const { setCurrentNode } = useCurrentNodeContext();
  const pathwayId = decodeURIComponent(id);
  const pathwayIndex = useMemo(() => pathways.findIndex(pathway => pathway.id === pathwayId), [
    pathwayId,
    pathways
  ]);
  const pathway = pathways[pathwayIndex];
  const currentNode = pathway?.nodes?.[decodeURIComponent(nodeId)];

  useEffect(() => {
    if (pathwayRef?.current?.id === pathway?.id) setPathway(pathway);
    else resetPathway(pathway);
  }, [pathway, pathwayRef, setPathway, resetPathway]);

  useEffect(() => {
    setCurrentNode(currentNode);
  }, [currentNode, setCurrentNode]);

  if (pathway == null) return null;
  if (currentNode == null) return <Redirect to={`/builder/${id}/node/Start`} />;

  return <Builder />;
};

export default memo(BuilderRoute);
