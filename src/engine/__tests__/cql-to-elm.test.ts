import { convertBasicCQL } from '../cql-to-elm';

const testCQL = "library mCODEResources version '1'";
const testELM = {
  library: {
    identifier: {
      id: 'mCODEResources',
      version: '1'
    }
  }
};

describe('cql-to-elm', () => {
  it('converts basic cql to elm', done => {
    global.fetch = jest.fn(() => Promise.resolve({ json: () => testELM }));
    convertBasicCQL(testCQL).then(elm => {
      expect(elm).toHaveProperty('library');
      expect(elm).toHaveProperty('library.identifier');
      expect(elm).toHaveProperty('library.identifier.id', 'mCODEResources');
      expect(elm).toHaveProperty('library.identifier.version', '1');
      done();
    });
  });
});
