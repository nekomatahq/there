import { BSON } from 'bson';

export const bsonTransformer = {
  serialize: (data: unknown): string => {
    const bsonBuffer = BSON.serialize({ data });
    return Buffer.from(bsonBuffer).toString('base64');
  },
  deserialize: (data: string): unknown => {
    const buffer = Buffer.from(data, 'base64');
    const result = BSON.deserialize(buffer) as { data: unknown };
    return result.data;
  },
};

