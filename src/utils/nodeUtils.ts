import { PathwayNode, PathwayActionNode } from 'pathways-model';

export function isActionNode(node: PathwayNode): node is PathwayActionNode {
  const { action } = node as PathwayActionNode;
  return action !== undefined;
}

export function isBranchNode(node: PathwayNode): boolean {
  const { action, label } = node as PathwayActionNode;
  return action === undefined && label !== 'Start';
}

type ConversionResource = {
  [key: string]: string;
};
export const resourceNameConversion: ConversionResource = {
  MedicationRequest: 'Medication',
  ServiceRequest: 'Procedure',
  CarePlan: 'Regimen'
};
