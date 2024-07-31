import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import { VectorStoreIndex } from "llamaindex";
import { MilvusVectorStore } from "llamaindex/storage/vectorStore/MilvusVectorStore";

const REQUIRED_ENV_VARS = [
  "MILVUS_ADDRESS",
  "MILVUS_USERNAME",
  "MILVUS_PASSWORD",
];

export function getMilvusClient() {
  return new MilvusClient({
    address: process.env.MILVUS_ADDRESS!,
    username: process.env.MILVUS_USERNAME!,
    password: process.env.MILVUS_PASSWORD!,
  });
}

export function checkRequiredEnvVars() {
  const missingEnvVars = REQUIRED_ENV_VARS.filter((envVar) => {
    return !process.env[envVar];
  });

  if (missingEnvVars.length > 0) {
    console.log(
      `The following environment variables are required but missing: ${missingEnvVars.join(
        ", ",
      )}`,
    );
    throw new Error(
      `Missing environment variables: ${missingEnvVars.join(", ")}`,
    );
  }
}

export async function getIndex(datasource: string) {
  checkRequiredEnvVars();
  const milvusClient = getMilvusClient();

  const store = new MilvusVectorStore({
    milvusClient,
    collection: datasource,
  });

  return await VectorStoreIndex.fromVectorStore(store);
}
