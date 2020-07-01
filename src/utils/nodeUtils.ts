import { PathwayNode, GuidanceNode } from 'pathways-model';

export function isGuidanceNode(node: PathwayNode): node is GuidanceNode {
  const { action } = node as GuidanceNode;
  return action !== undefined;
}

export function isBranchNode(node: PathwayNode): boolean {
  const { action, label } = node as GuidanceNode;
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
