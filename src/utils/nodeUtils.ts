import { PathwayNode, ActionNode, Pathway, Transition } from 'pathways-model';
import { History } from 'history';

export function isActionNode(node: PathwayNode): node is ActionNode {
  const { action } = node as ActionNode;
  return action !== null;
}

export function isBranchNode(node: PathwayNode): boolean {
  const { action, label, nodeTypeIsUndefined } = node as ActionNode;
  return action === undefined && label !== 'Start' && !nodeTypeIsUndefined;
}

type ConversionResource = {
  [key: string]: string;
};
export const resourceNameConversion: ConversionResource = {
  MedicationRequest: 'Medication',
  ServiceRequest: 'Procedure',
  CarePlan: 'Regimen'
};

export const nodeTypeOptions = [
  { label: 'Medication', value: 'MedicationRequest' },
  { label: 'Procedure', value: 'ServiceRequest' },
  { label: 'Regimen', value: 'CarePlan' },
  { label: 'Observation', value: 'Observation' }
];

export function findParents(pathway: Pathway, childNodeKey: string): string[] {
  const parents: string[] = [];
  Object.keys(pathway.nodes).forEach(parentNodeKey => {
    for (const transition of pathway.nodes[parentNodeKey].transitions) {
      if (transition.transition === childNodeKey) {
        parents.push(parentNodeKey);
        break;
      }
    }
  });
  return parents;
}

export function willOrphanChild(pathway: Pathway, childNodeKey: string): boolean {
  // Count the number of transitions into the node
  let transitionCount = 0;
  Object.keys(pathway.nodes).forEach(nodeKey => {
    pathway.nodes[nodeKey].transitions.forEach(transition => {
      if (transition.transition === childNodeKey) transitionCount += 1;
    });
  });

  return transitionCount >= 2 ? false : true;
}

export function canDeleteNode(pathway: Pathway, transitions: Transition[]): boolean {
  let canDeleteAllTransitions = true;
  transitions.forEach(transition => {
    if (willOrphanChild(pathway, transition.transition)) canDeleteAllTransitions = false;
  });
  return canDeleteAllTransitions;
}

export function redirect(
  pathwayId: string,
  nodeKey: string,
  history: History<History.PoorMansUnknown>
): void {
  const url = `/builder/${encodeURIComponent(pathwayId)}/node/${encodeURIComponent(nodeKey)}`;
  if (url !== history.location.pathname) {
    history.push(url);
  }
}

const getAncestorNodes = (
  pathway: Pathway,
  rootNodeKey: string,
  currNodeKey: string
): Array<PathwayNode> => {
  let ancestors: Array<PathwayNode> = [];
  let previousNodes: Array<PathwayNode> = [];
  const currNode = pathway.nodes[currNodeKey];

  currNode.transitions.forEach(transition => {
    if (transition.transition === rootNodeKey) ancestors.push(currNode);
    else {
      previousNodes = getAncestorNodes(pathway, rootNodeKey, transition.transition);
      if (previousNodes?.length) {
        if (!ancestors.some(node => node.key === currNode.key)) ancestors.push(currNode);
        ancestors = ancestors.concat(previousNodes);
      }
    }
  });

  return ancestors;
};

export const getConnectableNodes = (
  pathway: Pathway,
  rootNode: PathwayNode
): Array<{ label: string; value: string }> => {
  const connectableNodes: Array<{ label: string; value: string }> = [];
  const ancestorNodes = getAncestorNodes(pathway, rootNode.key ?? '', 'Start');
  ancestorNodes.push(rootNode);

  Object.keys(pathway.nodes).forEach(nodeKey => {
    const node = pathway.nodes[nodeKey];
    const rootNodeConnectsToNode = rootNode.transitions.some(
      transition => transition.transition === nodeKey
    );
    const nodeIsAncestor = ancestorNodes.some(node => node.key === nodeKey);
    if (!rootNodeConnectsToNode && !nodeIsAncestor && node.key)
      connectableNodes.push({ label: node.label, value: node.key });
  });

  return connectableNodes;
};
