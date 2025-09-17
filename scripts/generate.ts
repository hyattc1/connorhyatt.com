import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DocumentInterface } from "@langchain/core/documents";
import { Redis } from "@upstash/redis";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/vectordb";

async function generateEmbeddings() {
  try {
    console.log("Starting embeddings generation...");
    
    const vectorStore = await getVectorStore();
    console.log("Vector store initialized");

    // clear existing data
    try {
      (await getEmbeddingsCollection()).deleteMany({});
      (await Redis.fromEnv()).flushdb();
      console.log("Cleared existing embeddings data");
    } catch (error) {
      console.warn("Warning: Could not clear existing data:", error);
    }

    const routeLoader = new DirectoryLoader(
      "src/app",
      {
        ".tsx": (path) => new TextLoader(path),
      },
      true,
    );

    // routes
    const routes = (await routeLoader.load())
      .filter((route) => route.metadata.source.endsWith("page.tsx"))
      .map((route): DocumentInterface => {
        const url =
          route.metadata.source
            .replace(/\\/g, "/") // replace "\\" with "/"
            .split("/src/app")[1]
            .split("/page.tsx")[0] || "/";

        const pageContentTrimmed = route.pageContent
          .replace(/^import.*$/gm, "") // remove all import statements
          .replace(/ className=(["']).*?\1| className={.*?}/g, "") // remove all className props
          .replace(/^\s*[\r]/gm, "") // remove empty lines
          .trim();

        return { pageContent: pageContentTrimmed, metadata: { url } };
      });

    console.log(`Processed ${routes.length} routes`);

    const routesSplitter = RecursiveCharacterTextSplitter.fromLanguage("html");
    const splitRoutes = await routesSplitter.splitDocuments(routes);

    // resume data
    const dataLoader = new DirectoryLoader("src/data", {
      ".json": (path) => new TextLoader(path),
    });

    const data = await dataLoader.load();
    console.log(`Processed ${data.length} data files`);

    const dataSplitter = RecursiveCharacterTextSplitter.fromLanguage("js");
    const splitData = await dataSplitter.splitDocuments(data);

    // blog posts and background info
    const postLoader = new DirectoryLoader(
      "content",
      {
        ".mdx": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),
      },
      true,
    );

    const posts = (await postLoader.load())
      .filter((post) => post.metadata.source.endsWith(".mdx") || post.metadata.source.endsWith(".md"))
      .map((post): DocumentInterface => {
        // For .mdx files, only get content after frontmatter
        // For .md files, use the entire content
        const pageContentTrimmed = post.metadata.source.endsWith(".mdx") 
          ? post.pageContent.split("---")[2] || post.pageContent.split("---")[1] 
          : post.pageContent;

        // Generate proper URL for blog posts
        const filename = post.metadata.source.replace(/\\/g, "/").split("/").pop()?.replace(/\.(mdx?|md)$/, "");
        const url = `/blog/${filename}`;

        return { pageContent: pageContentTrimmed, metadata: { ...post.metadata, url } };
      });

    console.log(`Processed ${posts.length} blog posts`);

    const postSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown");
    const splitPosts = await postSplitter.splitDocuments(posts);

    await vectorStore.addDocuments(splitRoutes);
    await vectorStore.addDocuments(splitData);
    await vectorStore.addDocuments(splitPosts);
    
    console.log("Embeddings generation completed successfully!");
  } catch (error) {
    console.error("Error during embeddings generation:", error);
    // Don't throw the error to prevent build failure
    // The app can still work without embeddings
    process.exit(0);
  }
}

generateEmbeddings();
