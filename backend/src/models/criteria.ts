import { Schema, model } from 'mongoose';
import wrappedSchema from './wrappedSchema';

const criteriaSchema = wrappedSchema(
  new Schema(
    {
      id: String,
      label: String,
      version: String,
      modified: Number,
      statement: String,
      builder: Object,
      elm: Object,
      cql: String,
    },
    { _id: false }
  )
);

const Criteria = model('Criteria', criteriaSchema);

export default Criteria;
