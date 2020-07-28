import samplepathway from './fixtures/sample_pathway.json';
import { willOrphanChild, canDeleteNode, findParents } from 'utils/nodeUtils';

describe('node util methods', () => {
  describe('delete transition orphan check', () => {
    it('returns true for single parent', () => {
      const value = willOrphanChild(
        samplepathway,
        samplepathway.nodes['ChemoMedication'].transitions[0].transition
      );
      expect(value).toBeTruthy();
    });

    it('returns false for multiple parents', () => {
      const value = willOrphanChild(
        samplepathway,
        samplepathway.nodes['Surgery'].transitions[0].transition
      );
      expect(value).toBeFalsy();
    });
  });

  describe('can delete node', () => {
    it('returns true when no orphaned children', () => {
      let value = canDeleteNode(samplepathway, samplepathway.nodes['Surgery']);
      expect(value).toBeTruthy();
      value = canDeleteNode(samplepathway, samplepathway.nodes['Radiation']);
      expect(value).toBeTruthy();
    });

    it('returns false when orphaned children', () => {
      const value = canDeleteNode(samplepathway, samplepathway.nodes['N-test']);
      expect(value).toBeFalsy();
    });
  });

  it('find parents', () => {
    const parents = findParents(samplepathway, 'ChemoMedication');
    expect(parents).toEqual(['N-test', 'Surgery']);
  });
});
