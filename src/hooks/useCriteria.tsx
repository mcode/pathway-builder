import { useEffect, useState } from 'react';
import { Criteria } from 'criteria-model';
import { useQuery } from 'react-query';
import config from 'utils/ConfigManager';
import { useAlertContext } from 'components/AlertProvider';

interface UseCriteriaInterface {
  isLoading: boolean;
  error: unknown;
  criteria: Criteria[];
}

const useCriteria = (): UseCriteriaInterface => {
  const { setAlertText, setOpenAlert } = useAlertContext();
  const baseUrl = config.get('pathwaysBackend');
  const [criteria, setCriteria] = useState<Criteria[]>([]);

  const { isLoading, error, data } = useQuery('criteria', () =>
    fetch(`${baseUrl}/criteria/`)
      .then(async res => {
        const data = await res.json();
        if (res.ok) return data;
        else {
          console.error(res);
          setAlertText(`Error loading criteria. Server returned ${res.status}`);
          setOpenAlert(true);
          return [];
        }
      })
      .catch(error => {
        console.error(error);
        setAlertText('Error loading criteria. Please restart the server and try again.');
        setOpenAlert(true);
        return [];
      })
  );

  useEffect(() => {
    if (!error && !isLoading) setCriteria(data as Criteria[]);
  }, [isLoading, error, data]);

  return { isLoading, error, criteria };
};

export default useCriteria;
