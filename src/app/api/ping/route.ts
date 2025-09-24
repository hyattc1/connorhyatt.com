import { getVectorStore } from "@/lib/vectordb";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get the vector store to ensure AstraDB connection
    const vectorStore = await getVectorStore();
    
    // Perform a lightweight similarity search to keep AstraDB active
    // This will register activity with AstraDB to prevent hibernation
    await vectorStore.similaritySearch("ping", 1);
    
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Ping endpoint error:", error);
    
    return NextResponse.json(
      { 
        error: "failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
