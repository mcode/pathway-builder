declare module 'pathways-model' {
  import { ElmLibrary } from 'elm-model';
  import { DomainResource, MedicationRequest, ServiceRequest, CarePlan } from 'fhir-objects';

  export interface Pathway {
    id: string;
    name: string;
    description?: string;
    library: string;
    precondition: Precondition[];
    nodes: {
      [key: string]: PathwayActionNode | PathwayBranchNode | PathwayNode;
    };
    elm?: PathwayELM;
    // TODO: this should not be optional once we have the pathway builder
  }

  export interface PathwayELM {
    navigational?: object;
    precondition?: object;
  }

  export interface Precondition {
    id?: string;
    elementName: string; // name of the mCODE element
    expected: string; // human readable value
    cql: string; // cql to fetch the value from a patient
  }

  export interface PathwayNode {
    key?: string;
    label: string;
    transitions: Transition[];
    nodeTypeIsUndefined?: boolean;
  }

  export interface PathwayActionNode extends PathwayNode {
    cql: string;
    elm?: ElmLibrary;
    action: Action[];
  }

  // NOTE: the model also includes a BranchNode (which extends PathwayNode),
  // but as of right now it has no additional fields not in PathwayNode,
  // and TypeScript does not allow "empty" interfaces so we can't add it yet.
  // Add it here if/when we ever need it.
  export interface PathwayBranchNode extends PathwayNode {
    criteriaSource?: string;
    mcodeCriteria?: string;
    otherCriteria?: string;
  }
  interface Action {
    id?: string;
    type: string;
    description: string;
    resource: MedicationRequest | ServiceRequest | CarePlan;
  }

  interface Transition {
    id?: string;
    transition: string;
    condition?: {
      description: string;
      cql: string;
      elm?: ElmLibrary;
    };
  }
}
