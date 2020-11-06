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
import { useAlertContext } from './AlertProvider';

const BuilderRoute: FC = () => {
  const pathwayId = usePathwayId();
  const currentNodeId = useNodeId();
  const { setAlertText, setOpenAlert } = useAlertContext();
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
  else if (error) {
    setAlertText('Connection to server lost. Please save your work then restart the server.');
    setOpenAlert(true);
    return <Builder />;
  } else if (data) {
    if (currentNodeId && pathway?.nodes[currentNodeId]) return <Builder />;
    else return <Redirect to={`/builder/${pathwayId}/node/Start`} />;
  } else return <Redirect to={`/builder`} />;
};

export default memo(BuilderRoute);
