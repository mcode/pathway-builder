import React, { FC, memo, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import Builder from 'components/Builder';
import config from 'utils/ConfigManager';
import { useCurrentPathwayContext } from './CurrentPathwayProvider';
import { useCurrentNodeContext } from './CurrentNodeProvider';
import Loading from './elements/Loading';
import { Pathway } from 'pathways-model';

const BuilderRoute: FC = () => {
  const { id, nodeId } = useParams();
  const pathwayId = decodeURIComponent(id);
  const currentNodeId = decodeURIComponent(nodeId);
  const baseUrl = config.get('pathwaysBackend');
  const { setCurrentNode } = useCurrentNodeContext();
  const { pathwayRef, setCurrentPathway, resetCurrentPathway } = useCurrentPathwayContext();

  const { isLoading, error, data } = useQuery(['pathway', { id: id }], () =>
    fetch(`${baseUrl}/pathway/${pathwayId}`).then(res => res.json())
  );

  useEffect(() => {
    const pathway = data as Pathway;
    if (pathway) {
      if (pathwayRef?.current?.id === pathway.id) setCurrentPathway(pathway);
      else resetCurrentPathway(pathway);
      setCurrentNode(pathway.nodes[currentNodeId]);
    }
  }, [data, pathwayRef, currentNodeId, setCurrentNode, setCurrentPathway, resetCurrentPathway]);

  if (isLoading && !error) return <Loading />;
  // TODO: instead of showing error here show error on the builder screen as a toast
  else if (error) {
    alert('ERROR: Could not load pathway. Redirecting to Pathway List screen');
    return <Redirect to={`/builder`} />;
  } else if (data) {
    const pathway = data as Pathway;
    if (currentNodeId && pathway.nodes[currentNodeId]) return <Builder />;
    else return <Redirect to={`/builder/${id}/node/Start`} />;
  } else return <Redirect to={`/builder`} />;
};

export default memo(BuilderRoute);
