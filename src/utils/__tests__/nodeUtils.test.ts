import samplepathway from './fixtures/sample_pathway.json';
import {
  willOrphanChild,
  canDeleteNode,
  findParents,
  getConnectableNodes,
  isActionNode,
  isBranchNode
} from 'utils/nodeUtils';

describe('node util methods', () => {
  describe('can determine branch vs action node', () => {
    const branchNode = samplepathway.nodes['T-test'];
    const actionNode = samplepathway.nodes['Surgery'];

    it('isBranchNode on branch node is true', () => {
      const res = isBranchNode(branchNode);
      expect(res).toBeTruthy();
    });

    it('isBranchNode on action node is false', () => {
      const res = isBranchNode(actionNode);
      expect(res).toBeFalsy();
    });

    it('isActionNode on action node is true', () => {
      const res = isActionNode(actionNode);
      expect(res).toBeTruthy();
    });

    it('isActionNode on branch node is false', () => {
      const res = isActionNode(branchNode);
      expect(res).toBeFalsy();
    });
  });

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
      let value = canDeleteNode(samplepathway, samplepathway.nodes['Surgery'].transitions);
      expect(value).toBeTruthy();
      value = canDeleteNode(samplepathway, samplepathway.nodes['Radiation'].transitions);
      expect(value).toBeTruthy();
    });

    it('returns false when orphaned children', () => {
      const value = canDeleteNode(samplepathway, samplepathway.nodes['N-test'].transitions);
      expect(value).toBeFalsy();
    });
  });

  it('find parents', () => {
    const parents = findParents(samplepathway, 'ChemoMedication');
    expect(parents).toEqual(['N-test', 'Surgery']);
  });

  describe('get connectable nodes', () => {
    it('returns true when every node has potentially connectable nodes', () => {
      let value = true;
      for (const nodeKey of Object.keys(samplepathway.nodes)) {
        const connectableNodes = getConnectableNodes(samplepathway, samplepathway.nodes[nodeKey]);
        if (value && !connectableNodes?.length) value = false;
      }
      expect(value).toBeTruthy();
    });

    it('returns true when the N-test node has the expected number of potentially connectable nodes', () => {
      const expectedConnectableNodes = [
        { label: 'Surgery', value: 'Surgery' },
        { label: 'Chemotherapy', value: 'Chemo' }
      ];
      const connectableNodes = getConnectableNodes(samplepathway, samplepathway.nodes['N-test']);
      expect(connectableNodes).toEqual(expectedConnectableNodes);
    });
  });
});