import { constructCqlLibrary } from '../export';

describe(constructCqlLibrary, () => {
  describe('given a library name', () => {
    it('returns a simple CQL library with the specified library name', () => {
      const fooLib = constructCqlLibrary('FooLib', {}, {}, {});
      expect(fooLib).toContain("library FooLib version '1.0'");
    });
  });
});
