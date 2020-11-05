import { Schema, model } from 'mongoose';

const criteriaSchema = new Schema({
  id: String,
  label: String,
  display: String,
  version: String,
  modified: Number,
  statement: String,
  builder: Object,
  elm: Object,
  cql: String,
});

criteriaSchema.index({ id: 1 }, { unique: true });

const Criteria = model('Criteria', criteriaSchema);

export default Criteria;
