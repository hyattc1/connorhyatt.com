import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DocumentInterface } from "@langchain/core/documents";
import { Redis } from "@upstash/redis";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/vectordb";
import * as fs from "fs";
import * as path from "path";

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

    // resume data - parse JSON files and format them as readable text
    const dataDir = "src/data";
    const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));
    const formattedData: DocumentInterface[] = [];

    for (const file of dataFiles) {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(fileContent);
      const fileName = path.basename(file, ".json");

      let formattedText = "";

      if (fileName === "career" && jsonData.career) {
        formattedText = "Connor's Work Experience and Career:\n\n";
        for (const job of jsonData.career) {
          formattedText += `Company: ${job.name}\n`;
          formattedText += `Role: ${job.title}\n`;
          formattedText += `Period: ${job.start} - ${job.end || "Present"}\n`;
          if (job.href) {
            formattedText += `Website: ${job.href}\n`;
          }
          if (job.description && job.description.length > 0) {
            formattedText += `Responsibilities:\n`;
            job.description.forEach((desc: string) => {
              formattedText += `- ${desc}\n`;
            });
          }
          if (job.links && job.links.length > 0) {
            formattedText += `Links:\n`;
            job.links.forEach((link: { name: string; href: string }) => {
              formattedText += `- ${link.name}: ${link.href}\n`;
            });
          }
          formattedText += "\n";
        }
      } else if (fileName === "education" && jsonData.education) {
        formattedText = "Connor's Education:\n\n";
        for (const edu of jsonData.education) {
          formattedText += `Institution: ${edu.name}\n`;
          formattedText += `Degree: ${edu.title}\n`;
          formattedText += `Period: ${edu.start} - ${edu.end || "Present"}\n`;
          if (edu.href) {
            formattedText += `Website: ${edu.href}\n`;
          }
          if (edu.description && edu.description.length > 0) {
            formattedText += `Highlights:\n`;
            edu.description.forEach((desc: string) => {
              formattedText += `- ${desc}\n`;
            });
          }
          formattedText += "\n";
        }
      } else if (fileName === "projects" && jsonData.projects) {
        formattedText = "Connor's Projects:\n\n";
        for (const project of jsonData.projects) {
          formattedText += `Project: ${project.name}\n`;
          formattedText += `Description: ${project.description}\n`;
          if (project.href) {
            formattedText += `Link: ${project.href}\n`;
          }
          if (project.tags && project.tags.length > 0) {
            formattedText += `Technologies: ${project.tags.join(", ")}\n`;
          }
          if (project.links && project.links.length > 0) {
            formattedText += `Links:\n`;
            project.links.forEach((link: { name: string; href: string }) => {
              formattedText += `- ${link.name}: ${link.href}\n`;
            });
          }
          formattedText += "\n";
        }
      } else if (fileName === "socials" && jsonData.socials) {
        formattedText = "Connor's Social Media and Contact:\n\n";
        for (const social of jsonData.socials) {
          formattedText += `${social.name}: ${social.href}\n`;
        }
      } else {
        // Fallback: use JSON string for other files
        formattedText = JSON.stringify(jsonData, null, 2);
      }

      formattedData.push({
        pageContent: formattedText,
        metadata: { 
          source: filePath,
          type: fileName,
          url: fileName === "career" ? "/" : fileName === "projects" ? "/projects" : "/"
        }
      });
    }

    console.log(`Processed ${formattedData.length} data files`);

    const dataSplitter = RecursiveCharacterTextSplitter.fromLanguage("js");
    const splitData = await dataSplitter.splitDocuments(formattedData);

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
