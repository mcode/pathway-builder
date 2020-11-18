import { Schema, model } from 'mongoose';
import wrappedSchema from './wrappedSchema';

const pathwaySchema = wrappedSchema(
  new Schema(
    {
      id: String,
      name: String,
      description: String,
      library: [String],
      preconditions: [Object],
      nodes: Object,
      elm: Object,
    },
    { _id: false }
  )
);

const Pathway = model('Pathway', pathwaySchema);

export default Pathway;
