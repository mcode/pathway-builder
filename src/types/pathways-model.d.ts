declare module 'pathways-model' {
  import { ElmLibrary } from 'elm-model';
  import { DomainResource, MedicationRequest, ServiceRequest, CarePlan } from 'fhir-objects';

  export type NodeObj = { [key: string]: ActionNode | BranchNode | ReferenceNode | PathwayNode };

  export interface Pathway {
    id: string;
    name: string;
    description: string;
    library: string;
    preconditions: Precondition[];
    nodes: NodeObj;
    elm?: PathwayELM;
    // TODO: this should not be optional once we have the pathway builder
  }

  export interface PathwayELM {
    navigational?: object;
    preconditions?: object;
  }

  export interface Precondition {
    id: string;
    elementName: string; // name of the mCODE element
    expected: string; // human readable value
    cql: string; // cql to fetch the value from a patient
  }

  export interface PathwayNode {
    key: string;
    label: string;
    transitions: Transition[];
    nodeTypeIsUndefined?: boolean;
    type: 'action' | 'branch' | 'reference' | 'other';
  }

  export interface ActionNode extends PathwayNode {
    cql: string;
    elm?: ElmLibrary;
    action: Action;
  }

  // NOTE: the model also includes a BranchNode (which extends PathwayNode),
  // but as of right now it has no additional fields not in PathwayNode,
  // and TypeScript does not allow "empty" interfaces so we can't add it yet.
  // Add it here if/when we ever need it.
  export interface BranchNode extends PathwayNode {
    mcodeCriteria?: string;
    otherCriteria?: string;
  }

  export interface ReferenceNode extends PathwayNode {
    referenceId: string;
    referenceLabel: string;
  }

  interface Action {
    id: string;
    type: string;
    description: string;
    resource: MedicationRequest | ServiceRequest | CarePlan;
  }

  export interface Transition {
    id: string;
    transition: string;
    condition?: {
      description: string;
      cql: string;
      elm?: ElmLibrary;
      criteriaSource?: string;
    };
  }
}
