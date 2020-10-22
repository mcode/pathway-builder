import QueryFindOneAndUpdateOptions from 'mongoose';

declare module 'mongoose' {
  interface QueryFindOneAndUpdateOptions {
    overwrite?: boolean;
  }
}
