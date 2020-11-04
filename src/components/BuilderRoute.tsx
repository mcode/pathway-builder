import React, { FC, memo, useMemo, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import Builder from 'components/Builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
import { useCurrentPathwayContext } from './CurrentPathwayProvider';
import { useCurrentNodeContext } from './CurrentNodeProvider';

const BuilderRoute: FC = () => {
  const { id, nodeId } = useParams();
  const { pathways } = usePathwaysContext();
  const { pathwayRef, setCurrentPathway, resetCurrentPathway } = useCurrentPathwayContext();
  const { setCurrentNode } = useCurrentNodeContext();
  const pathwayId = decodeURIComponent(id);
  const pathwayIndex = useMemo(() => pathways.findIndex(pathway => pathway.id === pathwayId), [
    pathwayId,
    pathways
  ]);
  const pathway = pathways[pathwayIndex];
  const currentNodeId = decodeURIComponent(nodeId);

  useEffect(() => {
    if (pathway && pathwayRef?.current?.id === pathway.id) setCurrentPathway(pathway);
    else if (pathway) resetCurrentPathway(pathway);
  }, [pathway, pathwayRef, setCurrentNode, setCurrentPathway, resetCurrentPathway]);

  useEffect(() => {
    if (pathwayRef.current?.nodes[currentNodeId])
      setCurrentNode(pathwayRef.current.nodes[currentNodeId]);
    else if (pathway?.nodes[currentNodeId]) setCurrentNode(pathway.nodes[currentNodeId]);
    else if (pathway) setCurrentNode(pathway.nodes['Start']);
  }, [pathway, pathwayRef, currentNodeId, setCurrentNode]);

  if (pathway == null) return null;
  if (!currentNodeId) return <Redirect to={`/demo/builder/${id}/node/Start`} />;

  return <Builder />;
};

export default memo(BuilderRoute);
