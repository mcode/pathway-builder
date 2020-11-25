/**
 * Common interfaces and functions for exporting pathways
 */

// interface purely for intermediate working objects
export interface IncludedCqlLibraries {
  [id: string]: {
    cql: string;
    version: string;
  };
}

/**
 * Constructs a CQL Library based on the provided CQL
 *
 * @param libraryName - The name to be used in the library
 * @param includedCqlLibraries - Libraries that should be included
 * @param referencedDefines - Definitions that should be defined in the constructed library
 *                            based on a definition in an included library
 * @param builderDefines - Definitions from the CQL builder that should be included
 */
export function constructCqlLibrary(
  libraryName: string,
  includedCqlLibraries: IncludedCqlLibraries,
  referencedDefines: Record<string, string>,
  builderDefines: Record<string, string>
): string {
  const includes = Object.entries(includedCqlLibraries)
    .map(([name, details]) => `include "${name}" version '${details.version}' called ${name}\n\n`)
    .join('');
  const definesList = Object.entries(referencedDefines).map(
    ([name, srcLibrary]) => `define "${name}": ${srcLibrary}."${name}"\n\n`
  );

  Object.entries(builderDefines).forEach(([statement, cql]) =>
    definesList.push(`define "${statement}": ${cql}\n\n`)
  );

  const defines = definesList.join('');

  // NOTE: this library should use the same FHIR version as all referenced libraries
  // and if we want to run it in cqf-ruler, as of today that needs to be FHIR 4.0.1 (NOT 4.0.0)
  return `
library ${libraryName} version '1.0'

using FHIR version '4.0.1'

${includes}

context Patient

${defines}
`;
}
