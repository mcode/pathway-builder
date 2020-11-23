import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Pathway } from 'pathways-model';
import config from 'utils/ConfigManager';
import { useAlertContext } from 'components/AlertProvider';

interface UsePathwaysInterface {
  isLoading: boolean;
  error: unknown;
  pathways: Pathway[];
}

const usePathways = (): UsePathwaysInterface => {
  const { setAlertText, setOpenAlert } = useAlertContext();
  const baseUrl = config.get('pathwaysBackend');
  const [pathways, setPathway] = useState<Pathway[]>([]);

  const { isLoading, error, data } = useQuery('pathways', () =>
    fetch(`${baseUrl}/pathway/`)
      .then(async res => {
        const data = await res.json();
        if (res.ok) return data;
        else {
          console.error(res);
          setAlertText(`Error loading pathways. Server returned ${res.status}`);
          setOpenAlert(true);
          return [];
        }
      })
      .catch(error => {
        console.error(error);
        setAlertText('Error loading pathways. Please restart the server and try again.');
        setOpenAlert(true);
        return [];
      })
  );

  useEffect(() => {
    if (!error && !isLoading) setPathway(data as Pathway[]);
  }, [isLoading, error, data]);

  return { isLoading, error, pathways };
};

export default usePathways;
