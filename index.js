import { GoogleGenAI } from '@google/genai';

// Initialize Vertex with your Cloud project and location
const ai = new GoogleGenAI({
  vertexai: true,
  project: 'reactkick-gemini',
  location: 'global'
});
const model = 'gemini-2.5-pro';


// Set up generation config
const generationConfig = {
  maxOutputTokens: 65535,
  temperature: 1,
  topP: 1,
  seed: 0,
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'OFF',
    }
  ],
};


async function generateContent() {
  const req = {
    model: model,
    contents: [
    ],
    config: generationConfig,
  };

  const streamingResp = await ai.models.generateContentStream(req);

  for await (const chunk of streamingResp) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    } else {
      process.stdout.write(JSON.stringify(chunk) + '\n');
    }
  }
}

generateContent();
