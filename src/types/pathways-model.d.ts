declare module 'pathways-model' {
  import { DomainResource, MedicationRequest, ServiceRequest } from 'fhir-objects';

  export interface Pathway {
    id: string;
    name: string;
    description?: string;
    library: string;
    criteria: Criteria[];
    states: {
      [key: string]: GuidanceState | BranchState | State;
    };
    elm?: PathwayELM;
    // TODO: this should not be optional once we have the pathway builder
  }

  export interface PathwayELM {
    navigational?: object;
    criteria?: object;
  }

  export interface Criteria {
    id?: string;
    elementName: string; // name of the mCODE element
    expected: string; // human readable value
    cql: string; // cql to fetch the value from a patient
  }

  export interface State {
    key?: string;
    label: string;
    transitions: Transition[];
    nodeTypeIsUndefined?: boolean;
  }

  export interface GuidanceState extends State {
    cql: string;
    action: Action[];
  }

  export interface BranchState extends State {
    criteriaSource?: string;
    mcodeCriteria?: string;
    otherCriteria?: string;
  }

  interface Action {
    id?: string;
    type: string;
    description: string;
    resource: MedicationRequest | ServiceRequest;
  }

  interface Transition {
    id?: string;
    transition: string;
    condition?: {
      description: string;
      cql: string;
    };
  }
}
