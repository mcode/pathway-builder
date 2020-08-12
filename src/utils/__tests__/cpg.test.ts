import samplepathway from './fixtures/sample_pathway.json';
import { toCPG } from 'utils/cpg';
import { validate } from 'fhir-validator';

describe('convert pathway into cpg', () => {
  it('correctly converts sample pathway into cpg', () => {
    const cpgPathway = toCPG(samplepathway);
    const result = validate(cpgPathway);
    expect(result.errors.length).toBe(0);
  });
});
