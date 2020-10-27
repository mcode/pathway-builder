import { useEffect, useState } from 'react';
import { Criteria } from 'criteria-model';
import { useQuery } from 'react-query';
import config from 'utils/ConfigManager';

interface UseCriteriaInterface {
  isLoading: boolean;
  error: unknown;
  criteria: Criteria[];
}

const useCriteria = (): UseCriteriaInterface => {
  const baseUrl = config.get('pathwaysBackend');
  const [criteria, setCriteria] = useState<Criteria[]>([]);

  const { isLoading, error, data } = useQuery('criteria', () =>
    fetch(`${baseUrl}/criteria/`).then(res => res.json())
  );

  useEffect(() => {
    if (!error && !isLoading) setCriteria(data as Criteria[]);
  }, [isLoading, error, data]);

  return { isLoading, error, criteria };
};

export default useCriteria;
