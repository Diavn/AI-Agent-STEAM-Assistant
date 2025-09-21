import { GoogleGenAI, Chat, Part, HarmCategory, HarmBlockThreshold, type SafetySetting } from '@google/genai';
import type { AgentConfig } from '../types';

let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch(e) {
  console.error(e);
  throw new Error("Failed to initialize Gemini AI. Make sure API_KEY is set.");
}

const getSafetySettings = (setting: string): SafetySetting[] => {
  const thresholdMap: { [key: string]: HarmBlockThreshold } = {
    'block_none': HarmBlockThreshold.BLOCK_NONE,
    'block_some': HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    'balanced': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    'block_most': HarmBlockThreshold.BLOCK_ONLY_HIGH,
  };
  
  const threshold = thresholdMap[setting] || HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE;

  return [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold },
  ];
};

export const sendMessageToGemini = async (
  chatInstance: Chat | null,
  config: AgentConfig,
  message: string
): Promise<{ response: string; chat: Chat }> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized.");
  }
  
  let chat: Chat;

  if (chatInstance) {
    chat = chatInstance;
  } else {
    chat = ai.chats.create({
      model: config.model,
      config: {
        systemInstruction: config.persona,
        temperature: config.temperature,
        topK: config.topK,
        topP: config.topP,
        maxOutputTokens: config.maxOutputTokens,
        // FIX: Moved safetySettings into the config object.
        safetySettings: getSafetySettings(config.safetySetting),
      },
    });
  }

  const isFirstMessageInNewChat = !chatInstance;
  const hasFiles = config.files.length > 0;

  let result;

  if (isFirstMessageInNewChat && hasFiles) {
    const fileParts: Part[] = config.files.map(file => ({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data,
      },
    }));
    
    const content = [...fileParts, { text: message }];
    result = await chat.sendMessage({ message: content });
  } else {
    result = await chat.sendMessage({ message });
  }

  return { response: result.text, chat };
};
