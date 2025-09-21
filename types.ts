
export interface UploadedFile {
  name: string;
  mimeType: string;
  data: string; // base64 encoded string
}

export interface AgentConfig {
  name: string;
  persona: string;
  model: string;
  temperature: number;
  topK: number;
  topP: number;
  files: UploadedFile[];
  safetySetting: string;
  maxOutputTokens: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
