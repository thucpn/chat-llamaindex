import { VectorStoreIndex } from "llamaindex";
import { MilvusVectorStore } from "llamaindex/storage/vectorStore/MilvusVectorStore";
import { checkRequiredEnvVars, getMilvusClient } from "./shared";

export async function getDataSource(datasource: string) {
  checkRequiredEnvVars();
  const milvusClient = getMilvusClient();

  const store = new MilvusVectorStore({
    milvusClient,
    collection: datasource,
  });

  const isCollectionExist = await milvusClient.hasCollection({
    collection_name: datasource,
  });
  if (!isCollectionExist.value) {
    throw new Error(
      `Collection "${datasource}" does not exist! Run the generate script or mannually create the collection.`,
    );
  }

  return await VectorStoreIndex.fromVectorStore(store);
}
