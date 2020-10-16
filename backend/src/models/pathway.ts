import mongoose from 'mongoose';

const pathwaySchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  library: [String],
  preconditions: [Object],
  nodes: Object,
  elm: Object
});

const Pathway = mongoose.model('Pathway', pathwaySchema);

export default Pathway;
