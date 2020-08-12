declare module 'cpg-model' {
  export interface Action {
    id?: string;
    title?: string;
    description?: string;
    definitionUri: string;
    condition?: any[];
  }

  interface Expression {
    name?: string;
    description?: string;
    language: 'text/cql' | 'text/elm';
    expression: string;
  }
}
