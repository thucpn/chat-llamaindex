import {
  loadDocuments,
  saveDocument,
} from "@/cl/app/api/chat/llamaindex/documents/helper";
import { runPipeline } from "./pipeline";
import { getIndex } from "../engine/shared";

export async function uploadDocument(
  raw: string,
  datasource: string,
): Promise<string[]> {
  const [header, content] = raw.split(",");
  const mimeType = header.replace("data:", "").replace(";base64", "");
  const fileBuffer = Buffer.from(content, "base64");
  const documents = await loadDocuments(fileBuffer, mimeType);
  const { filename } = await saveDocument(fileBuffer, mimeType);
  const index = await getIndex(datasource);

  // Update documents with metadata
  for (const document of documents) {
    document.metadata = {
      ...document.metadata,
      file_name: filename,
      private: "true", // to separate from other public documents
    };
  }

  return await runPipeline(index, documents);
}
