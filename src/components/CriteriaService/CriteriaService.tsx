import { useState, useEffect } from 'react';
import { Service } from 'pathways-objects';

interface Criteria {
  id: string;
  label: string;
  version: string;
  modified: number;
  elm: object;
}

function getCriteria(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  });
}

function typedFetch<T>(url: string, options?: object): Promise<T> {
  return fetch(url, options).then(response => response.json() as Promise<T>);
}

const useGetCriteriaService = (url: string): Service<Criteria[]> => {
  const [result, setResult] = useState<Service<Criteria[]>>({
    status: 'loading'
  });

  useEffect(() => {
    getCriteria(url)
      .then(response => response.json() as Promise<string[]>)
      .then(listOfFiles => listOfFiles.map(f => typedFetch<Criteria>(url + '/' + f)))
      .then(listOfPromises => Promise.all(listOfPromises))
      .then(criteriaList => setResult({ status: 'loaded', payload: criteriaList }))
      .catch(error => setResult({ status: 'error', error }));
  }, [url]);

  return result;
};

export default useGetCriteriaService;
