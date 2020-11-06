import React, { FC, memo, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery } from 'react-query';

import Builder from 'components/Builder';
import config from 'utils/ConfigManager';
import { useCurrentPathwayContext } from './CurrentPathwayProvider';
import Loading from './elements/Loading';
import { Pathway } from 'pathways-model';
import usePathwayId from 'hooks/usePathwayId';
import useNodeId from 'hooks/useNodeId';

const BuilderRoute: FC = () => {
  const pathwayId = usePathwayId();
  const currentNodeId = useNodeId();
  const baseUrl = config.get('pathwaysBackend');
  const { pathway, pathwayRef, resetCurrentPathway } = useCurrentPathwayContext();

  const { isLoading, error, data } = useQuery('pathway', () =>
    fetch(`${baseUrl}/pathway/${pathwayId}`).then(res => res.json())
  );

  useEffect(() => {
    const pathway = data as Pathway;
    if (pathwayRef.current?.id !== pathway?.id) resetCurrentPathway(pathway);
  }, [data, pathwayRef, resetCurrentPathway]);

  if (isLoading && !error) return <Loading />;
  // TODO: instead of showing error here show error on the builder screen as a toast
  else if (error) {
    alert('ERROR: Could not load pathway. Redirecting to Pathway List screen');
    return <Redirect to={`/builder`} />;
  } else if (data) {
    if (currentNodeId && pathway?.nodes[currentNodeId]) return <Builder />;
    else return <Redirect to={`/builder/${pathwayId}/node/Start`} />;
  } else return <Redirect to={`/builder`} />;
};

export default memo(BuilderRoute);
