import { getVectorStore } from "@/lib/vectordb";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { Redis } from "@upstash/redis";
import { LangChainStream, Message, StreamingTextResponse } from "ai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const latestMessage = messages[messages.length - 1].content;

    const { stream, handlers } = LangChainStream();

    // store the same user questions
    const cache = new UpstashRedisCache({
      client: Redis.fromEnv(),
    });

    const chatModel = new ChatOpenAI({
      model: "gpt-4o-mini",
      streaming: true,
      callbacks: [handlers],
      verbose: true, // logs to console
      cache,
      temperature: 0,
    });

    const rephraseModel = new ChatOpenAI({
      model: "gpt-4o-mini",
      verbose: true,
      cache,
    });

    const retriever = (await getVectorStore()).asRetriever();

    // get a customised prompt based on chat history
    const chatHistory = messages
      .slice(0, -1) // ignore latest message
      .map((msg: Message) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      );

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user",
        "Given the above conversation history, generate a search query to look up information relevant to the current question. " +
          "Do not leave out any relevant keywords. " +
          "Only return the query and no other text. ",
      ],
    ]);

    const historyAwareRetrievalChain = await createHistoryAwareRetriever({
      llm: rephraseModel,
      retriever,
      rephrasePrompt,
    });

    // final prompt
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are Connor Support, a friendly chatbot for Connor's personal portfolio website. " +
          "You help people learn about Connor - his background, skills, projects, and interests. " +
          "Respond naturally and conversationally, as if you're Connor's friend helping someone get to know him. " +
          "IMPORTANT: Always answer questions based on the provided context below. The context contains detailed information about Connor's background, skills, career goals, and preferences. " +
          "If the context contains specific information about what you're being asked, use that information first and foremost. " +
          "Be concise and accurate. Provide links to pages that contain relevant information when appropriate. " +
          "When referencing internal site files or routes (paths beginning with /), always output absolute URLs using https://connorhyatt.com as the base. " +
          "For example, /ferretti_report.pdf must be written as https://connorhyatt.com/ferretti_report.pdf. " +
          "Never use placeholder domains like yourwebsite.com. " +
          "Format your messages in markdown.\n\n" +
          "Context:\n{context}",
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
      documentPrompt: PromptTemplate.fromTemplate(
        "Page content:\n{page_content}",
      ),
      documentSeparator: "\n------\n",
    });

    // 1. retrievalChain converts the {input} into a vector
    // 2. do a similarity search in the vector store and finds relevant documents
    // 3. pairs the documents to createStuffDocumentsChain and put into {context}
    // 4. send the updated prompt to chatgpt for a customised response

    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever: historyAwareRetrievalChain, // get the relevant documents based on chat history
    });

    retrievalChain.invoke({
      input: latestMessage,
      chat_history: chatHistory,
    });

    // Rewrite any placeholder domains and convert relative Markdown links to absolute URLs
    const transformed = stream
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(
        new TransformStream<string, string>({
          transform(chunk, controller) {
            let out = chunk;
            // Replace placeholder domain with the real domain
            out = out.replaceAll("https://yourwebsite.com", "https://connorhyatt.com");
            // Convert Markdown links like ](/path) to ](https://connorhyatt.com/path)
            out = out.replace(/\]\(\//g, "](" + "https://connorhyatt.com/");
            controller.enqueue(out);
          },
        }),
      )
      .pipeThrough(new TextEncoderStream());

    return new StreamingTextResponse(transformed);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
