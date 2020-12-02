import { ActionCqlLibrary, Pathway } from 'pathways-model';
import { Criteria } from 'criteria-model';
import { v4 as uuidv4 } from 'uuid';
import { deepCopyPathway } from './nodeUtils';
import { constructCqlLibrary, IncludedCqlLibraries } from './export';
import { convertCQL } from 'engine/cql-to-elm';
import { ElmLibrary } from 'elm-model';
import { setNavigationalElm } from './builder';
import { extractCQLLibraryName, extractCQLVersion } from './regexes';

export class CaminoExporter {
  pathway: Pathway;
  criteria: Criteria[];
  actionCqlLibraries: ActionCqlLibrary[];

  constructor(pathway: Pathway, criteria: Criteria[], actionCqlLibraries: ActionCqlLibrary[]) {
    this.pathway = deepCopyPathway(pathway);
    this.criteria = criteria;
    this.actionCqlLibraries = actionCqlLibraries;
  }

  export(): Promise<Pathway> {
    // goal here is to iterate through the pathway,
    // find all referenced libraries,
    // and update the CQL in the transition to point to them appropriately
    const libraryId = uuidv4();
    const mainLibraryName = `LIB${libraryId.substring(0, 7)}`;

    const includedCqlLibraries: IncludedCqlLibraries = {};
    const referencedDefines: Record<string, string> = {};

    const builderDefines: Record<string, string> = {};

    // Handle action cql
    this.actionCqlLibraries.forEach(cqlLibrary => {
      includedCqlLibraries[cqlLibrary.name] = {
        cql: cqlLibrary.cql,
        version: cqlLibrary.version
      };
      referencedDefines[cqlLibrary.nodeKey] = cqlLibrary.name;
    });

    // iterate through the nodes and find all criteria that are actually used.
    // for each one, add the criteria CQL to our appropriate map
    //  - if it's an included library, keep track of the library name and version
    //    as well as the specific definition we're referencing
    //  - if it was constructed in the builder, track the name and raw CQL
    for (const nodeId in this.pathway.nodes) {
      const node = this.pathway.nodes[nodeId];

      // Handle transition cql
      for (const transition of node.transitions) {
        if (transition.condition?.criteriaSource) {
          const criteriaSource = this.criteria.find(
            c => c.id === transition.condition?.criteriaSource
          );
          if (criteriaSource?.cql) {
            const transitionLibraryNameRegex = extractCQLLibraryName.exec(criteriaSource.cql);
            const transitionLibraryVersionRegex = extractCQLVersion.exec(criteriaSource.cql);
            if (transitionLibraryNameRegex && transitionLibraryVersionRegex) {
              const transitionLibraryName = transitionLibraryNameRegex[1].replace(/"/g, '');
              const transitionLibraryVersion = transitionLibraryVersionRegex[1];
              includedCqlLibraries[transitionLibraryName] = {
                cql: criteriaSource.cql,
                version: transitionLibraryVersion
              };

              referencedDefines[transition.condition.cql] = transitionLibraryName;

              if (criteriaSource?.cqlLibraries) {
                Object.entries(criteriaSource.cqlLibraries).forEach(entry => {
                  const [libName, libCql] = entry;
                  if (libCql.cql) {
                    includedCqlLibraries[libName] = {
                      cql: libCql.cql,
                      version: libCql?.version || ''
                    };
                  }
                });
              }

              // prepend the library name if not already done
              if (!transition.condition.cql.startsWith(transitionLibraryName)) {
                transition.condition.cql = `${transitionLibraryName}.${transition.condition.cql}`;
              }
            }
          } else if (criteriaSource?.builder) {
            builderDefines[criteriaSource.statement] = criteriaSource.builder.cql;

            // prepend the library name
            transition.condition.cql = `${mainLibraryName}.${transition.condition.cql}`;
          }
        }
      }
    }

    const libraries: string[] = [];

    const mainLibrary = constructCqlLibrary(
      mainLibraryName,
      includedCqlLibraries,
      referencedDefines,
      builderDefines
    );
    libraries.push(mainLibrary);

    // add any other libraries
    if (Object.keys(includedCqlLibraries).length > 0) {
      const addtlLibraries = Object.values(includedCqlLibraries).map(l => l.cql);
      libraries.push(...addtlLibraries);
    }

    this.pathway.library = libraries;

    // Convert all of the cql libraries to elm
    includedCqlLibraries[mainLibraryName] = {
      cql: mainLibrary,
      version: '1.0'
    };
    return convertCQL(includedCqlLibraries).then(elmLibraries => {
      const mainElmLibrary = elmLibraries[mainLibraryName];
      const otherElmLibraries: ElmLibrary[] = [];
      Object.keys(elmLibraries).forEach(elmLibraryName => {
        if (elmLibraryName !== mainLibraryName)
          otherElmLibraries.push(elmLibraries[elmLibraryName]);
      });
      return setNavigationalElm(this.pathway, [mainElmLibrary, ...otherElmLibraries]);
    });
  }
}
