// External CQL -> ELM service
import config from 'utils/ConfigManager';
import { ElmLibrary } from 'elm-model';

const url = config.get('cqlToElmWebserviceUrl');

export function convertBasicCQL(cql: string): Promise<ElmLibrary> {
  // Connect to web service

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/cql',
      Accept: 'application/elm+json'
    },
    body: cql
  }).then(elm => elm.json());
}
