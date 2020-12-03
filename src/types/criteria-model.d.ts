declare module 'criteria-model' {
  export interface Criteria {
    id: string;
    label: string;
    display: string;
    cql: string;
    version?: string;
    builder?: BuilderModel;
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
    cql: string;
    text?: string;
  }

  interface Age {
    type: 'age';
    min: number;
    max: number;
    cql: string;
    text?: string;
  }

  export type BuilderModel = Age | Gender;
}
