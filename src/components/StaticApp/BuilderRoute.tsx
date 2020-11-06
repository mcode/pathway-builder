import React, { FC, memo, useMemo, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Builder from 'components/StaticApp/Builder';
import { usePathwaysContext } from 'components/StaticApp/PathwaysProvider';
import { useCurrentPathwayContext } from './CurrentPathwayProvider';
import usePathwayId from 'hooks/usePathwayId';
import useNodeId from 'hooks/useNodeId';

const BuilderRoute: FC = () => {
  const pathwayId = usePathwayId();
  const currentNodeId = useNodeId();
  const { pathways } = usePathwaysContext();
  const { pathwayRef, setCurrentPathway, resetCurrentPathway } = useCurrentPathwayContext();
  const pathwayIndex = useMemo(() => pathways.findIndex(pathway => pathway.id === pathwayId), [
    pathwayId,
    pathways
  ]);
  const pathway = pathways[pathwayIndex];

  useEffect(() => {
    if (pathway && pathwayRef?.current?.id === pathway.id) setCurrentPathway(pathway);
    else if (pathway) resetCurrentPathway(pathway);
  }, [pathway, pathwayRef, setCurrentPathway, resetCurrentPathway]);

  if (pathway == null) return null;
  if (!currentNodeId) return <Redirect to={`/demo/builder/${pathwayId}/node/Start`} />;

  return <Builder />;
};

export default memo(BuilderRoute);
