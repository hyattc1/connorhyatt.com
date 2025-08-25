const OpenAI = require('openai');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testEmbeddings() {
  try {
    console.log('Testing OpenAI Embeddings API...');
    console.log('API Key (first 10 chars):', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
    
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "Hello world",
    });
    
    console.log('✅ Embeddings API works! Response length:', response.data[0].embedding.length);
  } catch (error) {
    console.error('❌ Embeddings API error:', error.message);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
  }
}

testEmbeddings();
