import { PathwayNode, ActionNode, Pathway, Transition, NodeObj } from 'pathways-model';
import { History } from 'history';
import shortid from 'shortid';

export function isActionNode(node: PathwayNode): node is ActionNode {
  const { action } = node as ActionNode;
  return action !== undefined;
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

export function findParent(nodes: NodeObj, childNodeKey: string): string | null {
  const parents = findParents(nodes, childNodeKey);
  if (parents.length === 1) return parents[0];
  else return null;
}

export function findParents(nodes: NodeObj, childNodeKey: string): string[] {
  const parents: string[] = [];
  Object.keys(nodes).forEach(parentNodeKey => {
    for (const transition of nodes[parentNodeKey].transitions) {
      if (transition.transition === childNodeKey) {
        parents.push(parentNodeKey);
        break;
      }
    }
  });
  return parents;
}

export function findAllTransistions(nodes: NodeObj, key: string): Transition[] {
  const transitions: Transition[] = [];
  const parents = findParents(nodes, key);
  parents.forEach(parentKey => {
    const parent = nodes[parentKey];
    parent.transitions.forEach(transition => {
      if (transition.transition === key) transitions.push(transition);
    });
  });
  return transitions;
}

export function findAllChildActionNodes(nodes: NodeObj, key: string): string[] {
  const childActionNodes: string[] = [];

  const childKeys = nodes[key].transitions.map(t => t.transition);
  childKeys.forEach(childKey => {
    const child = nodes[childKey];
    if (isActionNode(child)) childActionNodes.push(childKey);
    else childActionNodes.push(...findAllChildActionNodes(nodes, childKey));
  });

  return childActionNodes;
}

export function deepCopyPathway(pathway: Pathway): Pathway {
  return JSON.parse(JSON.stringify(pathway)) as Pathway;
}

export function deepCopyPathwayNode(node: PathwayNode): PathwayNode {
  return JSON.parse(JSON.stringify(node)) as PathwayNode;
}

function copyNode(node: PathwayNode, newKey: string): PathwayNode {
  const newNode = deepCopyPathwayNode(node);
  newNode.key = newKey;
  return newNode;
}

export function findSubPathway(nodes: NodeObj, rootKey: string): NodeObj {
  const subPathway: NodeObj = {};
  const oldKeyToNewKey: { [key: string]: string } = {};

  const transitions = (node: PathwayNode): string[] => node.transitions.map(t => t.transition);

  // Copy the nodes over to the new sub pathway
  let currentKey = rootKey;
  let currentNewKey = shortid.generate();
  oldKeyToNewKey[currentKey] = currentNewKey;
  subPathway[currentNewKey] = copyNode(nodes[currentKey], currentNewKey);
  const queue = transitions(nodes[currentKey]);
  const visited = [currentKey];
  while (queue.length) {
    // currentKey is always defined because queue.length > 0
    currentKey = queue.shift()!; // eslint-disable-line
    if (!visited.includes(currentKey)) {
      currentNewKey = shortid.generate();
      oldKeyToNewKey[currentKey] = currentNewKey;
      subPathway[currentNewKey] = copyNode(nodes[currentKey], currentNewKey);
      queue.push(...transitions(nodes[currentKey]));
      visited.push(currentKey);
    }
  }

  // Update the transitions to use the new keys
  Object.keys(subPathway).forEach(key => {
    const node = subPathway[key];
    node.transitions.forEach(
      transition => (transition.transition = oldKeyToNewKey[transition.transition])
    );
  });

  return subPathway;
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

export const getTransition = (parent: PathwayNode, childKey: string): Transition | undefined => {
  return parent.transitions.find(transition => transition.transition === childKey);
};
