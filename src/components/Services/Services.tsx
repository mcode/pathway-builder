import { useState, useEffect } from 'react';
import { Service } from 'pathways-objects';

function getObject(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  });
}

function typedFetch<T>(url: string, options?: object): Promise<T> {
  return fetch(url, options).then(response => response.json() as Promise<T>);
}

function useGetService<T>(url: string, type: T): Service<Array<T>> {
  const [result, setResult] = useState<Service<Array<T>>>({
    status: 'loading'
  });

  useEffect(() => {
    getObject(url)
      .then(response => response.json() as Promise<string[]>)
      .then(listOfFiles => listOfFiles.map(f => typedFetch<T>(url + '/' + f)))
      .then(listOfPromises => Promise.all(listOfPromises))
      .then(list => setResult({ status: 'loaded', payload: list }))
      .catch(error => setResult({ status: 'error', error }));
  }, [url]);

  return result;
}

export default useGetService;
