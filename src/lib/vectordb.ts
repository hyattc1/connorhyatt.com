import { DataAPIClient } from "@datastax/astra-db-ts";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { OpenAIEmbeddings } from "@langchain/openai";

const endpoint = process.env.ASTRA_DB_API_ENDPOINT || "";
const token = process.env.ASTRA_DB_APPLICATION_TOKEN || "";
const collection = process.env.ASTRA_DB_COLLECTION || "";

if (!endpoint || !token || !collection) {
  throw new Error("Please set environmental variables for Astra DB!");
}

// Cache embeddings instance to avoid recreation
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// Cache vector store instance
let vectorStorePromise: Promise<AstraDBVectorStore> | null = null;

export async function getVectorStore() {
  if (!vectorStorePromise) {
    vectorStorePromise = AstraDBVectorStore.fromExistingIndex(embeddings, {
      token,
      endpoint,
      collection,
      collectionOptions: {
        vector: { dimension: 1536, metric: "cosine" },
      },
    });
  }
  return vectorStorePromise;
}

export async function getEmbeddingsCollection() {
  const client = new DataAPIClient(token);
  const db = client.db(endpoint);

  return db.collection(collection);
}
