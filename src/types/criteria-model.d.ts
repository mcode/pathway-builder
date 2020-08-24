declare module 'criteria-model' {
  import { ElmLibrary } from 'elm-model';

  export interface Criteria {
    id: string;
    label: string;
    version: string;
    modified: number;
    elm: ElmLibrary;
    statement: string;
  }
}
