import 'mongoose';

// https://stackoverflow.com/questions/47422588/extend-typescript-definitelytyped-definition-file
declare module 'mongoose' {
  interface QueryFindOneAndUpdateOptions {
    overwrite?: boolean;
  }
}

export {};
