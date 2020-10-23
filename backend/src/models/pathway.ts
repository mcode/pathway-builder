import { Schema, model } from 'mongoose';

const pathwaySchema = new Schema({
  id: String,
  name: String,
  description: String,
  library: [String],
  preconditions: [Object],
  nodes: Object,
  elm: Object,
});

pathwaySchema.index({ id: 1 }, { unique: true });

const Pathway = model('Pathway', pathwaySchema);

export default Pathway;
