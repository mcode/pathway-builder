import { Pathway } from 'pathways-model';
import { Criteria } from 'criteria-model';
import { v4 as uuidv4 } from 'uuid';
import { deepCopyPathway } from './nodeUtils';

// interface purely for intermediate working objects
interface IncludedCqlLibraries {
  [id: string]: {
    cql: string;
    version: string;
  };
}

export class CaminoExporter {
  pathway: Pathway;
  criteria: Criteria[];

  // TODO: figure out if elm works correctly here
  constructor(pathway: Pathway, criteria: Criteria[]) {
    this.pathway = deepCopyPathway(pathway);
    this.criteria = criteria;
  }

  export(): Pathway {
    // goal here is to iterate through the pathway,
    // find all referenced libraries,
    // and update the CQL in the transition to point to them appropriately
    const libraryId = uuidv4();
    const libraryName = `LIB${libraryId.substring(0, 7)}`;

    const includedCqlLibraries: IncludedCqlLibraries = {};
    const referencedDefines: Record<string, string> = {};

    const builderDefines: Record<string, string> = {};

    // iterate through the nodes and find all criteria that are actually used.
    // for each one, add the criteria CQL to our appropriate map
    //  - if it's an included library, keep track of the library name and version
    //    as well as the specific definition we're referencing
    //  - if it was constructed in the builder, track the name and raw CQL
    for (const nodeId in this.pathway.nodes) {
      const node = this.pathway.nodes[nodeId];
      for (const transition of node.transitions) {
        if (transition.condition?.criteriaSource) {
          const criteriaSource = this.criteria.find(
            c => c.id === transition.condition?.criteriaSource
          );
          if (criteriaSource?.elm && criteriaSource?.cql) {
            const libraryIdentifier = criteriaSource.elm.library.identifier;
            includedCqlLibraries[libraryIdentifier.id] = {
              cql: criteriaSource.cql,
              version: libraryIdentifier.version
            };

            referencedDefines[transition.condition.cql] = libraryIdentifier.id;

            // prepend the library name
            transition.condition.cql = `${libraryIdentifier.id}.${transition.condition.cql}`;
          } else if (criteriaSource?.builder) {
            builderDefines[criteriaSource.statement] = criteriaSource.builder.cql;

            // prepend the library name
            transition.condition.cql = `${libraryName}.${transition.condition.cql}`;
          }
        }
      }
    }

    const libraries: string[] = [];

    if (Object.keys(builderDefines).length > 0) {
      // intentionally do not include any extra libraries here
      const mainLibrary = constructCqlLibrary(libraryName, {}, {}, builderDefines);
      libraries.push(mainLibrary);
    }

    // add any other libraries
    if (Object.keys(includedCqlLibraries).length > 0) {
      const addtlLibraries = Object.values(includedCqlLibraries).map(l => l.cql);
      libraries.push(...addtlLibraries);
    }

    this.pathway.library = libraries;

    return this.pathway;
  }
}

function constructCqlLibrary(
  libraryName: string,
  includedCqlLibraries: IncludedCqlLibraries,
  referencedDefines: Record<string, string>,
  builderDefines: Record<string, string>
): string {
  const includes = Object.entries(includedCqlLibraries)
    .map(([name, details]) => `include "${name}" version '${details.version}' called ${name}\n\n`)
    .join('');
  const definesList = Object.entries(referencedDefines).map(
    ([name, srcLibrary]) => `define "${name}": ${srcLibrary}.${name}\n\n`
  );

  Object.entries(builderDefines).forEach(([statement, cql]) =>
    definesList.push(`define "${statement}": ${cql}\n\n`)
  );

  const defines = definesList.join('');

  // NOTE: this library should use the same FHIR version as all referenced libraries
  // and if we want to run it in cqf-ruler, as of today that needs to be FHIR 4.0.1 (NOT 4.0.0)
  const libraryCql = `
library ${libraryName} version '1.0'

using FHIR version '4.0.1'

${includes}

context Patient

${defines}
`;

  return libraryCql;
}
