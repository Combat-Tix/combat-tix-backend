import { client, indices } from "../lib/algolia.js";

export const saveRecordToAlgolia = async ({ indexType, body }) => {
  if (indices.includes(indexType)) {
    await client.saveObject({
      indexName: indexType,
      body,
    });
  }
};
