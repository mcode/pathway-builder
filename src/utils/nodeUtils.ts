import { PathwayNode, ActionNode } from 'pathways-model';

export function isActionNode(node: PathwayNode): node is ActionNode {
  const { action } = node as ActionNode;
  return action !== undefined;
}

export function isBranchNode(node: PathwayNode): boolean {
  const { action, label } = node as ActionNode;
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
