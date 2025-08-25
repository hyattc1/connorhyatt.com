const OpenAI = require('openai');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAPI() {
  try {
    console.log('Testing OpenAI API key...');
    console.log('API Key (first 10 chars):', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10,
    });
    
    console.log('✅ API key works! Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ API key error:', error.message);
    console.error('Full error:', error);
  }
}

testAPI();
