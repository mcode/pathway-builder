declare module 'criteria-model' {
  import { ElmLibrary } from 'elm-model';

  export interface CriteriaModel {
    id: string;
    label: string;
    display: string;
    version?: string;
    modified: number;
    statement: string;
    cqlLibraries?: {
      [name: string]: {
        cql?: string;
        version?: string;
      };
    };
  }

  interface Gender {
    type: 'gender';
    gender: string;
    text?: string;
  }

  interface Age {
    type: 'age';
    min: number;
    max: number;
    text?: string;
  }

  export type BuilderModel = Age | Gender;
  export type CriteriaExecutionModel = { builder?: BuilderModel; elm: ElmLibrary; cql: string };
  export type Criteria = CriteriaModel & CriteriaExecutionModel;
}
