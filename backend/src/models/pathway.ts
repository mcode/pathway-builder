import mongoose from 'mongoose';

const pathwaySchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  library: [String],
  preconditions: [Object],
  nodes: Object,
  elm: Object,
});

pathwaySchema.index({ id: 1 }, { unique: true });

const Pathway = mongoose.model('Pathway', pathwaySchema);

export default Pathway;
