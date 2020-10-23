import { Schema, model } from 'mongoose';

const workspaceSchema = new Schema({
  id: String,
});

workspaceSchema.index({ id: 1 }, { unique: true });

const Workspace = model('Workspace', workspaceSchema);

export default Workspace;
