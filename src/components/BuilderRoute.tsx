import React, { FC, memo, useMemo, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import Builder from 'components/Builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
import { useCurrentPathwayContext } from './CurrentPathwayProvider';

const BuilderRoute: FC = () => {
  const { id, nodeId } = useParams();
  const { pathways } = usePathwaysContext();
  const { pathwayRef, setCurrentPathway, resetCurrentPathway } = useCurrentPathwayContext();
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
  }, [pathway, pathwayRef, setCurrentPathway, resetCurrentPathway]);

  if (pathway == null) return null;
  if (!currentNodeId) return <Redirect to={`/demo/builder/${id}/node/Start`} />;

  return <Builder />;
};

export default memo(BuilderRoute);
