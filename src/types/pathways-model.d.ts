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
    elm?: ElmLibrary;
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
      elm?: ElmLibrary;
    };
  }

  export interface ElmLibrary {
    library: {
      identifier: {
        id: string;
        version: string;
      };
      schemaIdentifier: {
        id: string;
        version: string;
      };
      usings: {
        def: {
          localId?: string;
          locator?: string;
          localIdentifier: string;
          uri: string;
          version?: string;
        }[];
      };
      includes: {
        def: {
          localId?: string;
          locator?: string;
          localIdentifier?: string;
          path: string;
          version: string;
        }[];
      };
      valueSets: {
        def: {
          localId?: string;
          locator?: string;
          name: string;
          id: string;
          accessLevel: string;
          resultTypeSpecifier: object;
        }[];
      };
      codes?: {
        def: object[];
      };
      codeSystems?: {
        def: object[];
      };
      concepts?: {
        def: object[];
      };
      statements: {
        def: ElmStatement[];
      };
      [x: string]: object;
    };
  }

  export interface ElmStatement {
    name: string;
    context: string;
    expression: object;
    locator?: string;
    locatorId?: string;
    accessLevel?: string;
    resultTypeName?: string;
    annotation?: object[];
  }
}
