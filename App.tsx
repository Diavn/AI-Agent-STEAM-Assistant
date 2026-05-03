
import React, { useState, useCallback, useRef } from 'react';
import { AgentConfig, ChatMessage, UploadedFile } from './types';
import { DEFAULT_AGENT_CONFIG, AVAILABLE_MODELS } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import AgentConfigurator from './components/AgentConfigurator';
import ChatPanel from './components/ChatPanel';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(DEFAULT_AGENT_CONFIG);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const invalidateChat = useCallback(() => {
    chatRef.current = null;
    setChatHistory([]);
  }, []);

  const handleConfigChange = <K extends keyof AgentConfig>(
    key: K,
    value: AgentConfig[K]
  ) => {
    setAgentConfig((prevConfig) => ({
      ...prevConfig,
      [key]: value,
    }));
    invalidateChat();
  };
  
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleFileAdd = async (newFiles: FileList) => {
    invalidateChat();
    const currentFileNames = new Set(agentConfig.files.map(f => f.name));
    const filesToAdd = Array.from(newFiles).filter(f => !currentFileNames.has(f.name));

    if (filesToAdd.length === 0) return;

    try {
      const uploadedFiles: UploadedFile[] = await Promise.all(
        filesToAdd.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return {
            name: file.name,
            mimeType: file.type,
            data: arrayBufferToBase64(arrayBuffer),
          };
        })
      );

      setAgentConfig((prev) => ({
        ...prev,
        files: [...prev.files, ...uploadedFiles],
      }));
    } catch(err) {
      console.error("Error processing files: ", err);
      setError("Failed to upload and process files.");
    }
  };

  const handleFileRemove = (fileName: string) => {
    invalidateChat();
    setAgentConfig((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.name !== fileName),
    }));
  };

  const handleSendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);
    const userMessage: ChatMessage = { role: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const { response, chat } = await sendMessageToGemini(chatRef.current, agentConfig, message);
      chatRef.current = chat; // Store the updated chat session
      const modelMessage: ChatMessage = { role: 'model', text: response };
      setChatHistory((prev) => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setChatHistory((prev) => prev.filter((msg) => msg !== userMessage)); // Remove user message on failure
    } finally {
      setIsLoading(false);
    }
  }, [agentConfig, invalidateChat]);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans">
      <header className="bg-dark-card border-b border-dark-border py-4 px-8">
       <h1 className="text-2xl font-bold text-white tracking-wider">
  Mentora AI Math & STEM Coach
</h1>
<p className="text-dark-text-secondary">
  Hỗ trợ giáo viên thiết kế bài học và giúp học sinh học Toán/STEM từng bước.
</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        <div className="md:col-span-1">
          <AgentConfigurator
            config={agentConfig}
            onConfigChange={handleConfigChange}
            models={AVAILABLE_MODELS}
            onFileAdd={handleFileAdd}
            onFileRemove={handleFileRemove}
          />
        </div>
        <div className="md:col-span-2">
          <ChatPanel
            agentName={agentConfig.name}
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
