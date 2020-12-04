// External CQL -> ELM service
import config from 'utils/ConfigManager';
import { Client } from 'cql-translation-service-client';
import { CqlLibraries } from 'cql-translation-service-client'
import { ElmLibrary as BuilderElmLibrary, ElmLibraries as BuilderElmLibraries } from 'elm-model'

const url = config.get('cqlToElmWebserviceUrl');

const client = new Client(url);

/**
 * Function that requests web_service to convert the cql into elm.
 * @param cqlLibraries - object containing CqlLibraries that is the input to the function.
 * @return The resulting elm translation of the cql libraries.
 */
export function convertCQL(cqlLibraries: CqlLibraries): Promise<BuilderElmLibraries> {
  return client.convertCQL(cqlLibraries) as Promise<BuilderElmLibraries>;
}

export function convertBasicCQL(cql: string): Promise<BuilderElmLibrary> {
  return client.convertBasicCQL(cql) as Promise<BuilderElmLibrary>;
}

export type { CqlLibraries } from 'cql-translation-service-client';
