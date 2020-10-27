import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Pathway } from 'pathways-model';
import config from 'utils/ConfigManager';

interface UsePathwaysInterface {
  isLoading: boolean;
  error: unknown;
  pathways: Pathway[];
}

const usePathways = (): UsePathwaysInterface => {
  const baseUrl = config.get('pathwaysBackend');
  const [pathways, setPathway] = useState<Pathway[]>([]);

  const { isLoading, error, data } = useQuery('pathways', () =>
    fetch(`${baseUrl}/pathway/`).then(res => res.json())
  );

  useEffect(() => {
    if (!error && !isLoading) setPathway(data as Pathway[]);
  }, [isLoading, error, data]);

  return { isLoading, error, pathways };
};

export default usePathways;
