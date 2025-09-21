
import React, { useRef } from 'react';
import type { AgentConfig } from '../types';
import { SAFETY_SETTINGS_OPTIONS, MAX_OUTPUT_TOKENS_OPTIONS } from '../constants';
import Card from './ui/Card';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import FileIcon from './icons/FileIcon';
import TrashIcon from './icons/TrashIcon';

interface AgentConfiguratorProps {
  config: AgentConfig;
  onConfigChange: <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => void;
  models: string[];
  onFileAdd: (files: FileList) => void;
  onFileRemove: (fileName: string) => void;
}

const AgentConfigurator: React.FC<AgentConfiguratorProps> = ({ config, onConfigChange, models, onFileAdd, onFileRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileAdd(event.target.files);
      if(event.target) event.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-dark-border pb-3">Agent Configuration</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="agentName" className="block text-sm font-medium text-dark-text-secondary mb-1">Agent Name</label>
            <Input
              id="agentName"
              value={config.name}
              onChange={(e) => onConfigChange('name', e.target.value)}
              placeholder="e.g., Creative Writer"
            />
          </div>
          <div>
            <label htmlFor="persona" className="block text-sm font-medium text-dark-text-secondary mb-1">Persona / System Instruction</label>
            <Textarea
              id="persona"
              value={config.persona}
              onChange={(e) => onConfigChange('persona', e.target.value)}
              placeholder="Describe the agent's personality and instructions."
              rows={6}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-dark-text-secondary mb-1">Knowledge Base</label>
             <div className="space-y-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    className="hidden"
                    aria-hidden="true"
                />
                <Button onClick={handleUploadClick} className="w-full !py-2 !text-sm !font-normal">
                    Upload Files
                </Button>
                {config.files.length > 0 && (
                    <div className="space-y-2 pt-2">
                        <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                            {config.files.map((file) => (
                                <li key={file.name} className="flex items-center justify-between bg-dark-input p-2 rounded-md text-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileIcon className="text-dark-text-secondary flex-shrink-0 h-4 w-4"/>
                                        <span className="text-dark-text truncate" title={file.name}>{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => onFileRemove(file.name)}
                                        className="text-dark-text-secondary hover:text-red-400 transition-colors p-1"
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <TrashIcon className="h-4 w-4"/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
             </div>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-dark-text-secondary mb-1">Model</label>
            <Select
              id="model"
              value={config.model}
              onChange={(e) => onConfigChange('model', e.target.value)}
            >
              {models.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Select>
          </div>

          <div className="border-t border-dark-border pt-4">
             <h3 className="text-lg font-semibold text-white mb-3">Safety & Style</h3>
             <div className="space-y-4">
                <div>
                    <label htmlFor="safetySetting" className="block text-sm font-medium text-dark-text-secondary mb-1">Safety Setting</label>
                    <Select
                      id="safetySetting"
                      value={config.safetySetting}
                      onChange={(e) => onConfigChange('safetySetting', e.target.value)}
                    >
                      {SAFETY_SETTINGS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                </div>
                <div>
                    <label htmlFor="maxOutputTokens" className="block text-sm font-medium text-dark-text-secondary mb-1">Max Output Length</label>
                    <Select
                      id="maxOutputTokens"
                      value={config.maxOutputTokens}
                      onChange={(e) => onConfigChange('maxOutputTokens', parseInt(e.target.value, 10))}
                    >
                       {MAX_OUTPUT_TOKENS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                </div>
             </div>
          </div>


          <div className="border-t border-dark-border pt-4">
             <h3 className="text-lg font-semibold text-white mb-3">Model Parameters</h3>
             <div className="space-y-4">
                <div>
                    <label htmlFor="temperature" className="flex justify-between text-sm font-medium text-dark-text-secondary mb-1">
                        <span>Temperature</span>
                        <span>{config.temperature.toFixed(2)}</span>
                    </label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={config.temperature}
                        onChange={(e) => onConfigChange('temperature', parseFloat(e.target.value))}
                        className="w-full h-2 bg-dark-input rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                </div>
                <div>
                    <label htmlFor="topP" className="flex justify-between text-sm font-medium text-dark-text-secondary mb-1">
                        <span>Top-P</span>
                         <span>{config.topP.toFixed(2)}</span>
                    </label>
                    <input
                        id="topP"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={config.topP}
                        onChange={(e) => onConfigChange('topP', parseFloat(e.target.value))}
                        className="w-full h-2 bg-dark-input rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                </div>
                <div>
                    <label htmlFor="topK" className="flex justify-between text-sm font-medium text-dark-text-secondary mb-1">
                        <span>Top-K</span>
                        <span>{config.topK}</span>
                    </label>
                    <input
                        id="topK"
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={config.topK}
                        onChange={(e) => onConfigChange('topK', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-dark-input rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                </div>
             </div>
          </div>

        </div>
      </div>
    </Card>
  );
};

export default AgentConfigurator;
