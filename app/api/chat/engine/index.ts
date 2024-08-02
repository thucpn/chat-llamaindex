import { VectorStoreIndex } from "llamaindex";
import { MilvusVectorStore } from "llamaindex/storage/vectorStore/MilvusVectorStore";
import {
  checkRequiredEnvVars,
  getMilvusClient,
} from "@/cl/app/api/chat/engine/shared";

export async function getDataSource(datasource: string) {
  console.log(`Using datasource: ${datasource}`);
  checkRequiredEnvVars({ checkCollectionEnv: false }); // Do not check for collection env var
  const milvusClient = getMilvusClient();
  const isCollectionExist = await milvusClient.hasCollection({
    collection_name: datasource,
  });
  if (!isCollectionExist.value) {
    return null;
  }
  const store = new MilvusVectorStore({ milvusClient, collection: datasource });
  return await VectorStoreIndex.fromVectorStore(store);
}