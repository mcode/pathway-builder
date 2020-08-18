import samplepathway from './fixtures/sample_pathway.json';
import { toCPG, createActivityDefinition, createPlanDefinition } from 'utils/cpg';

describe('convert pathway into cpg', () => {
  it('correctly converts sample pathway into cpg', () => {
    const cpgPathway = toCPG(samplepathway);
    expect(cpgPathway.type).toBe('transaction');
    expect(cpgPathway.entry.length).toBe(12);
    cpgPathway.entry.forEach(entry => {
      expect(entry.fullUrl).toBeDefined();
      expect(entry.resource).toBeDefined();
      expect(entry.request).toBeDefined();
    });
  });

  describe('convert action into activity definition', () => {
    it('converts service request correctly', () => {
      const action = samplepathway.nodes['Surgery'].action[0];
      const result = createActivityDefinition(action);
      expect(result.description).toBe(action.description);
      expect(result.kind).toBe('ServiceRequest');
      expect(result.productCodeableConcept.coding[0].code).toBe('392021009');
    });

    it('converts medication request correctly', () => {
      const action = samplepathway.nodes['ChemoMedication'].action[0];
      const result = createActivityDefinition(action);
      expect(result.description).toBe(action.description);
      expect(result.kind).toBe('MedicationRequest');
      expect(result.productCodeableConcept.coding[0].code).toBe('1790099');
    });
  });

  describe('create plan definitions', () => {
    it('creates strategy definition', () => {
      const result = createPlanDefinition('1234', 'title', 'description', 'strategy', '0000');
      const profile = result.meta?.profile;
      expect(result.resourceType).toBe('PlanDefinition');
      expect(profile).toEqual([
        'http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-strategydefinition'
      ]);
      expect(result.id).toBe('1234');
      expect(result.title).toBe('title');
      expect(result.description).toBe('description');
      expect(result.library).toEqual(['urn:uuid:0000']);
      expect(result.action.length).toBe(0);
    });

    it('creates recommendation definition', () => {
      const result = createPlanDefinition('1234', 'title', 'description', 'recommendation');
      const profile = result.meta?.profile;
      expect(result.resourceType).toBe('PlanDefinition');
      expect(profile).toEqual([
        'http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-recommendationdefinition'
      ]);
      expect(result.id).toBe('1234');
      expect(result.title).toBe('title');
      expect(result.description).toBe('description');
      expect(result.library).not.toBeDefined();
      expect(result.action.length).toBe(0);
    });
  });
});
