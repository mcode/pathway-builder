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
    id: String,
  });

  // Add a unique index to the child schema id
  schema.index({ id: 1 }, { unique: true });

  return schema;
};

interface ObjectWithID {
  id: string;
}

const wrapData = (data: ObjectWithID[] | ObjectWithID): object => {
  return Array.isArray(data)
    ? data.map((d) => wrapData(d))
    : { metadata: {}, value: data, id: data.id };
};

export default wrappedSchema;
export { wrapData };
export type { ObjectWithID };
