import her2pathway from './fixtures/her2_pathway.json';
import samplepathway from './fixtures/sample_pathway.json';
import neoadjuvantpathway from './fixtures/neoadjuvant_pathway.json';
import { CPGExporter, cleanPathway } from 'utils/cpg';
import { findParents } from 'utils/nodeUtils';

describe('convert pathway into cpg', () => {
  it('correctly converts sample pathway into cpg', () => {
    const exporter = new CPGExporter(samplepathway, []);
    const cpgPathway = exporter.export();
    expect(cpgPathway.type).toBe('transaction');
    expect(cpgPathway.entry.length).toBe(6);
    cpgPathway.entry.forEach(entry => {
      expect(entry.fullUrl).toBeDefined();
      expect(entry.resource).toBeDefined();
      expect(entry.request).toBeDefined();
    });
  });

  it('correctly converts her2+ pathway into cpg', () => {
    const exporter = new CPGExporter(her2pathway, []);
    const cpgPathway = exporter.export();
    expect(cpgPathway.entry.length).toBe(5);
  });

  it('correctly converts neoadjuvant pathway into cpg', () => {
    const exporter = new CPGExporter(neoadjuvantpathway, []);
    const cpgPathway = exporter.export();
    expect(cpgPathway.entry.length).toBe(9);
  });

  describe('clean pathway before processing', () => {
    it('removes multiple parents from sample pathway', () => {
      const newNodes = cleanPathway(samplepathway.nodes);
      const newNodeKeys = Object.keys(newNodes);
      expect(newNodeKeys.length).toBe(10);
      newNodeKeys.forEach(key => {
        expect(findParents(newNodes, key).length).toBeLessThanOrEqual(1);
      });
    });

    it('removes multiple parents from her2+ pathway', () => {
      const newNodes = cleanPathway(her2pathway.nodes);
      const newNodeKeys = Object.keys(newNodes);
      expect(newNodeKeys.length).toBe(15);
      newNodeKeys.forEach(key => {
        expect(findParents(newNodes, key).length).toBeLessThanOrEqual(1);
      });
    });

    it('removes multiple parents from neoadjuvant pathway', () => {
      const newNodes = cleanPathway(neoadjuvantpathway.nodes);
      const newNodeKeys = Object.keys(newNodes);
      expect(newNodeKeys.length).toBe(47);
      newNodeKeys.forEach(key => {
        expect(findParents(newNodes, key).length).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('convert action into activity definition', () => {
    const exporter = new CPGExporter(samplepathway, []);

    it('converts service request correctly', () => {
      const action = samplepathway.nodes['Surgery'].action;
      const result = exporter.createActivityDefinition(action);
      expect(result.description).toBe(action.description);
      expect(result.kind).toBe('ServiceRequest');
      expect(result.code.coding[0].code).toBe('392021009');
    });

    it('converts medication request correctly', () => {
      const action = samplepathway.nodes['ChemoMedication'].action;
      const result = exporter.createActivityDefinition(action);
      expect(result.description).toBe(action.description);
      expect(result.kind).toBe('MedicationRequest');
      expect(result.productCodeableConcept.coding[0].code).toBe('1790099');
    });
  });

  describe('create plan definitions', () => {
    const exporter = new CPGExporter(samplepathway, []);

    it('creates strategy definition', () => {
      const result = exporter.createPlanDefinition(
        '1234',
        'title',
        'description',
        'strategy',
        '0000'
      );
      const profile = result.meta?.profile;
      expect(result.resourceType).toBe('PlanDefinition');
      expect(profile).toEqual([
        'http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-strategydefinition'
      ]);
      expect(result.id).toBe('1234');
      expect(result.title).toBe('title');
      expect(result.description).toBe('description');
      expect(result.library).toEqual(['0000']);
      expect(result.action.length).toBe(0);
    });

    it('creates recommendation definition', () => {
      const result = exporter.createPlanDefinition(
        '1234',
        'title',
        'description',
        'recommendation'
      );
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
