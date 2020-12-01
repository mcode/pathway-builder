// External CQL -> ELM service
import config from 'utils/ConfigManager';
import {
  extractJSONContent,
  extractMultipartBoundary,
  extractMultipartFileName
} from 'utils/regexes';
import { ElmLibrary, ElmLibraries } from 'elm-model';

const url = config.get('cqlToElmWebserviceUrl');

export interface CqlLibraries {
  [name: string]: {
    cql: string;
    version?: string;
  };
}

/**
 * Function that requests web_service to convert the cql into elm.
 * @param cqlLibraries - object containing CqlLibraries that is the input to the function.
 * @return The resulting elm translation of the cql libraries.
 */
export function convertCQL(cqlLibraries: CqlLibraries): Promise<ElmLibraries> {
  // Connect to web service
  const formdata = new FormData();
  Object.keys(cqlLibraries).forEach((key, i) => {
    const cqlLibrary = cqlLibraries[key];
    if (cqlLibrary.cql) {
      formdata.append(`${key}`, cqlLibrary.cql);
    }
  });

  return fetch(url, {
    method: 'POST',
    body: formdata
  }).then(elm => {
    const header = elm.headers.get('content-type');
    let boundary = '';
    if (header) {
      // sample header= "multipart/form-data;boundary=Boundary_1"
      const result = extractMultipartBoundary.exec(header);
      boundary = result ? `--${result[1]}` : '';
    }
    const elmLibraries: ElmLibraries = {};
    return elm.text().then(text => {
      const elms = text.split(boundary).reduce((oldArray, line, i) => {
        const body = extractJSONContent.exec(line);
        if (body) {
          const elmName = extractMultipartFileName.exec(line);
          if (elmName) oldArray[elmName[1]] = JSON.parse(body[1]);
        }
        return oldArray;
      }, elmLibraries);

      return elms;
    });
  });
}

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
