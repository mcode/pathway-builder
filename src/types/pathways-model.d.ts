declare module 'pathways-model' {
  import { DomainResource, MedicationRequest, ServiceRequest } from 'fhir-objects';
  export interface Pathway {
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
    elementName: string; // name of the mCODE element
    expected: string; // human readable value
    cql: string; // cql to fetch the value from a patient
  }

  export interface State {
    label: string;
    transitions: Transition[];
  }

  export interface GuidanceState extends State {
    cql: string;
    action: Action[];
  }

  // NOTE: the model also includes a BranchState (which extends State),
  // but as of right now it has no additional fields not in State,
  // and TypeScript does not allow "empty" interfaces so we can't add it yet.
  // Add it here if/when we ever need it.

  interface Action {
    type: string;
    description: string;
    resource: MedicationRequest | ServiceRequest;
  }
  interface Transition {
    transition: string;
    condition?: {
      description: string;
      cql: string;
    };
  }

  export interface PathwayContextInterface {
    pathway: Pathway | null;
    setPathway: (pathway: Pathway | null, selectPathway?: boolean) => void;
  }
}
