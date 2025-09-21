
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import RobotIcon from './icons/RobotIcon';
import UserIcon from './icons/UserIcon';
import SendIcon from './icons/SendIcon';

interface ChatPanelProps {
  agentName: string;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ agentName, chatHistory, onSendMessage, isLoading, error }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };
  
  const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isModel = message.role === 'model';
    return (
      <div className={`flex items-start gap-4 ${isModel ? '' : 'justify-end'}`}>
        {isModel && <div className="flex-shrink-0 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white"><RobotIcon /></div>}
        <div className={`max-w-xl p-4 rounded-xl shadow-md ${isModel ? 'bg-dark-input text-dark-text' : 'bg-brand-primary text-white'}`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        {!isModel && <div className="flex-shrink-0 w-8 h-8 bg-brand-secondary rounded-full flex items-center justify-center text-white"><UserIcon /></div>}
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-xl font-bold text-white">Chat with: {agentName}</h2>
        <p className="text-sm text-dark-text-secondary">This is a preview of your configured agent.</p>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {chatHistory.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-dark-text-secondary">
                <RobotIcon className="w-16 h-16 mb-4"/>
                <p>No messages yet.</p>
                <p>Send a message to start the conversation.</p>
            </div>
        )}
        {chatHistory.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white"><RobotIcon /></div>
                <div className="max-w-xl p-4 rounded-xl shadow-md bg-dark-input text-dark-text">
                    <Spinner />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-dark-border">
        {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 w-full bg-dark-input border border-dark-border rounded-lg py-2 px-4 text-dark-text placeholder-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200"
          />
          <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
             {isLoading ? <Spinner /> : <SendIcon />}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatPanel;
