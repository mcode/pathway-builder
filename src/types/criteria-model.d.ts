declare module 'criteria-model' {
  import { ElmLibrary } from 'elm-model';

  export interface Criteria {
    id: string;
    label: string;
    version?: string;
    modified: number;
    elm?: ElmLibrary;
    statement?: string;
    cql?: string;
    builder?: BuilderModel;
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
