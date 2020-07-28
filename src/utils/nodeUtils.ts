import { PathwayNode, ActionNode, Pathway } from 'pathways-model';
import { History } from 'history';

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

export function canDeleteNode(pathway: Pathway, node: PathwayNode): boolean {
  let canDeleteAllTransitions = true;
  node.transitions.forEach(transition => {
    if (willOrphanChild(pathway, transition.transition)) canDeleteAllTransitions = false;
  });
  return canDeleteAllTransitions;
}

export function redirect(
  pathwayId: string,
  nodeId: string,
  history: History<History.PoorMansUnknown>
): void {
  const url = `/builder/${encodeURIComponent(pathwayId)}/node/${encodeURIComponent(nodeId)}`;
  if (url !== history.location.pathname) {
    history.push(url);
  }
}
