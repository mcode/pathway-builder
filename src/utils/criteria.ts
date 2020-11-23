import { BuilderModel, Criteria } from 'criteria-model';
import { ElmLibrary, ElmStatement } from 'elm-model';
import { convertBasicCQL, convertCQL, CqlLibraries } from 'engine/cql-to-elm';
import shortid from 'shortid';
import { updateCriteria } from './backend';

const DEFAULT_ELM_STATEMENTS = [
  'Patient',
  'MeetsInclusionCriteria',
  'InPopulation',
  'Recommendation',
  'Rationale',
  'Errors'
];

export function elmLibraryToCriteria(
  elm: ElmLibrary,
  cql: string | undefined = undefined,
  cqlLibraries: CqlLibraries | undefined = undefined,
  custom = false
): Criteria[] {
  // the cql-to-elm webservice always responds with ELM
  // even if the CQL was complete garbage
  // TODO: consider showing the error messages from the annotations?
  if (!elm.library?.identifier?.id) {
    // we're async right now so don't show an error here
    // just return empty
    return [];
  }
  const allElmStatements: ElmStatement[] = elm.library.statements.def;
  let elmStatements = allElmStatements.filter(def => !DEFAULT_ELM_STATEMENTS.includes(def.name));
  const includesTypes = !!allElmStatements.find(s => s.resultTypeName);
  if (includesTypes) {
    // if we have types, filter down to just booleans
    elmStatements = elmStatements.filter(
      s => s.resultTypeName === '{urn:hl7-org:elm-types:r1}Boolean'
    );
  }
  if (!elmStatements) {
    alert('No elm statement found in that file');
    return [];
  }
  const labelTitle = custom
    ? `Criteria Builder (${elm.library.identifier.id.substring(0, 5)})`
    : elm.library.identifier.id;
  return elmStatements.map(statement => {
    return {
      id: shortid.generate(),
      label: `${labelTitle}: ${statement.name}`,
      display: statement.name,
      version: elm.library.identifier.version,
      modified: Date.now(),
      elm: elm,
      cql: cql,
      statement: statement.name,
      ...(cqlLibraries && { cqlLibraries })
    };
  });
}

export function cqlToCriteria(cql: string | CqlLibraries): Promise<Criteria[]> {
  if (typeof cql === 'string')
    return convertBasicCQL(cql).then(elm => elmLibraryToCriteria(elm, cql));
  else {
    return convertCQL(cql).then(elm => {
      // Append library versions
      Object.keys(elm).forEach(key => {
        const cqlLibrary = cql[key];
        const elmLibrary = elm[key];
        if (cqlLibrary) cqlLibrary.version = elmLibrary.library.identifier.version;
      });

      // Loop through all elm libraries searching for criteria, use other libraries as dependencies
      return Object.keys(elm)
        .map(key => {
          // Exclude current library from the list of cql libraries to pass to elmLibraryToCriteria
          const { [key]: keyToExclude, ...dependencies } = cql;
          return elmLibraryToCriteria(elm[key], cql[key].cql, dependencies);
        })
        .flat(1);
    });
  }
}

export function jsonToCriteria(rawElm: string): Criteria[] | undefined {
  const elm = JSON.parse(rawElm);
  if (!elm.library?.identifier) {
    alert('Please upload ELM file');
    return;
  }
  return elmLibraryToCriteria(elm);
}

export function builderModelToCriteria(
  criteria: BuilderModel,
  label: string,
  id?: string
): Criteria {
  return {
    id: id ? id : shortid.generate(),
    label,
    display: label,
    modified: Date.now(),
    builder: criteria,
    statement: label
  };
}

export function addBuilderCriteria(
  buildCriteria: BuilderModel,
  label: string,
  criteriaSource: string | undefined
): Criteria[] {
  const newCriteria = builderModelToCriteria(buildCriteria, label, criteriaSource);

  updateCriteria(newCriteria);

  return [newCriteria];
}
