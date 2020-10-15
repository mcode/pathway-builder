import React, { FC, memo, useMemo, useEffect, useState } from 'react';
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
  const currentNodeId = decodeURIComponent(nodeId);

  useEffect(() => {
    if (pathwayRef.current) setCurrentNode(pathwayRef.current.nodes[currentNodeId]);
    if (pathwayRef?.current?.id === pathway?.id) setPathway(pathway);
    else resetPathway(pathway);
  }, [pathway, pathwayRef, setPathway, resetPathway]);

  useEffect(() => {
    if (pathwayRef.current?.nodes[currentNodeId])
      setCurrentNode(pathwayRef.current.nodes[currentNodeId]);
    else if (pathway?.nodes[currentNodeId]) setCurrentNode(pathway.nodes[currentNodeId]);
    else if (pathway) setCurrentNode(pathway.nodes['Start']);
  }, [pathway, pathwayRef, currentNodeId, setCurrentNode]);

  if (pathway == null) return null;
  if (!currentNodeId) return <Redirect to={`/builder/${id}/node/Start`} />;

  return <Builder />;
};

export default memo(BuilderRoute);
