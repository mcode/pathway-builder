import { constructCqlLibrary, IncludedCqlLibraries } from '../export';

describe(constructCqlLibrary, () => {
  describe('given only a library name', () => {
    const libName = 'FooLib';
    it('returns a CQL library with the specified library name', () => {
      const fooLib = constructCqlLibrary(libName, {}, {}, {});
      // Have the right library name
      expect(fooLib).toContain(`library ${libName} version '1.0'`);
      // Contain no additional libraries
      expect(fooLib).not.toContain('include');
      // Defines no methods
      expect(fooLib).not.toContain('define');
    });
    describe('and additional libraries to include', () => {
      const includeLibs: IncludedCqlLibraries = {
        BarLib: { cql: 'barr', version: '42' },
        BazLib: { cql: 'bazz', version: '24' }
      };
      it('returns a CQL library with the specified library name and includes the additional libraries', () => {
        const fooLib = constructCqlLibrary(libName, includeLibs, {}, {});
        // Have the right library name
        expect(fooLib).toContain(`library ${libName} version '1.0'`);
        // Contains the libraries which should be included
        Object.entries(includeLibs).forEach(([name, details]) => {
          expect(fooLib).toContain(`include "${name}" version '${details.version}' called ${name}`);
        });
        // Defines no methods
        expect(fooLib).not.toContain('define');
      });
      describe('and provides definitions which should be redefined', () => {
        const refDef: Record<string, string> = { quxDef: 'BarLib', quuxDef: 'BazLib' };
        it('returns a CQL library with the specified library name and includes the additional libraries', () => {
          const fooLib = constructCqlLibrary(libName, includeLibs, refDef, {});
          // Have the right library name
          expect(fooLib).toContain(`library ${libName} version '1.0'`);
          // Contains the libraries which should be included
          Object.entries(includeLibs).forEach(([name, details]) => {
            expect(fooLib).toContain(
              `include "${name}" version '${details.version}' called ${name}`
            );
          });
          // Redefines the referenced definitions
          Object.entries(refDef).forEach(([name, srcLib]) => {
            expect(fooLib).toContain(`define "${name}": ${srcLib}."${name}"`);
          });
          // Only contains the referenced definitions
          expect(fooLib.match(/define/g) || []).toHaveLength(2);
        });
        describe('and provides additional methods to be defined', () => {
          const buildDef: Record<string, string> = {
            isMale: "'Patient.gender.value = 'Male'",
            isFemale: "Patient.gender.value = 'Female'"
          };
          it('returns a CQL library with the specified library name, includes the additional libraries and redefines functions from the additional libraries', () => {
            const fooLib = constructCqlLibrary(libName, includeLibs, refDef, buildDef);
            // Have the right library name
            expect(fooLib).toContain(`library ${libName} version '1.0'`);
            // Contains the libraries which should be included
            Object.entries(includeLibs).forEach(([name, details]) => {
              expect(fooLib).toContain(
                `include "${name}" version '${details.version}' called ${name}`
              );
            });
            // Redefines the referenced definitions
            Object.entries(refDef).forEach(([name, srcLib]) => {
              expect(fooLib).toContain(`define "${name}": ${srcLib}."${name}"`);
            });
            // Contains the new definitions
            Object.entries(buildDef).forEach(([name, cql]) => {
              expect(fooLib).toContain(`define "${name}": ${cql}`);
            });
          });
        });
      });
    });
  });
});
