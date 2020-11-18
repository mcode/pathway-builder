import { Schema, model } from 'mongoose';
import wrappedSchema from './wrappedSchema';

const workspaceSchema = wrappedSchema(
  new Schema(
    {
      id: String,
    },
    { _id: false }
  )
);

const Workspace = model('Workspace', workspaceSchema);

export default Workspace;
