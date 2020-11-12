import { Schema } from 'mongoose';

/**
 * Returns a new schema with two top level fields: `metadata` and `value`.
 * The child schema passed into the function will be the the value of the `value` field.
 *
 * @param childSchema
 */
const wrappedSchema = (childSchema: Schema): Schema => {
  const schema = new Schema({
    metadata: Object,
    value: childSchema,
  });

  // Add a unique index to the child schema id
  schema.index({ 'value.id': 1 }, { unique: true });

  return schema;
};

export default wrappedSchema;
