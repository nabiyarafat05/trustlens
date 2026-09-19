'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, MessageSquare, Globe, FileText, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { ImageDropzone } from './ImageDropzone';
import { TextInputMode } from './TextInputMode';
import { UrlInputMode } from './UrlInputMode';
import { DocInputMode } from './DocInputMode';
import { PresetPicker } from './PresetPicker';
import { Button } from '../ui/Button';
import { SampleScenario } from '@/lib/presets/sampleScenarios';
import { AnalysisRequest } from '@/lib/ai/types';

interface SmartScannerProps {
  onStartAnalysis: (payload: AnalysisRequest) => void;
  isLoading: boolean;
}

type TabType = 'image' | 'text' | 'url' | 'document';

export function SmartScanner({ onStartAnalysis, isLoading }: SmartScannerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');

  // Input states
  const [textContent, setTextContent] = useState<string>('');
  const [urlContent, setUrlContent] = useState<string>('');
  const [redactPii, setRedactPii] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<{
    dataUri: string;
    mimeType: string;
    fileName: string;
    fileSize: number;
  } | null>(null);
  const [documentFile, setDocumentFile] = useState<{
    fileName: string;
    fileSize: number;
    mimeType: string;
    textPreview?: string;
  } | null>(null);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Load a preset scenario into the scanner
  const handleSelectPreset = (scenario: SampleScenario) => {
    setValidationError(null);
    if (scenario.inputType === 'text') {
      setActiveTab('text');
      setTextContent(scenario.targetContent);
    } else if (scenario.inputType === 'url') {
      setActiveTab('url');
      setUrlContent(scenario.targetContent);
    } else if (scenario.inputType === 'image') {
      setActiveTab('image');
      // Set text fallback or guide
      setTextContent(scenario.targetContent);
    }
  };

  const handleAnalyze = useCallback(() => {
    setValidationError(null);

    let payload: AnalysisRequest | null = null;

    if (activeTab === 'image') {
      if (!imageFile) {
        setValidationError('Please upload or paste an image/screenshot first.');
        return;
      }
      payload = {
        type: 'image',
        fileData: imageFile.dataUri,
        mimeType: imageFile.mimeType,
        fileName: imageFile.fileName,
        content: `Image screenshot: ${imageFile.fileName}`,
        redactPii,
      };
    } else if (activeTab === 'text') {
      if (!textContent.trim()) {
        setValidationError('Please paste or type the suspicious message or email text.');
        return;
      }
      payload = {
        type: 'text',
        content: textContent.trim(),
        redactPii,
      };
    } else if (activeTab === 'url') {
      if (!urlContent.trim()) {
        setValidationError('Please enter a website address to evaluate.');
        return;
      }
      payload = {
        type: 'url',
        content: urlContent.trim(),
        redactPii: false,
      };
    } else if (activeTab === 'document') {
      if (!documentFile) {
        setValidationError('Please select a document or PDF file.');
        return;
      }
      payload = {
        type: 'document',
        content: documentFile.textPreview || `Document: ${documentFile.fileName}`,
        fileName: documentFile.fileName,
        mimeType: documentFile.mimeType,
        redactPii,
      };
    }

    if (payload) {
      onStartAnalysis(payload);
    }
  }, [activeTab, imageFile, textContent, urlContent, documentFile, redactPii, onStartAnalysis]);

  // Global Ctrl + Enter listener for instant analysis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyze();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnalyze]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode; countHint?: string }[] = [
    {
      id: 'text',
      label: 'Message / Text',
      icon: <MessageSquare className="w-4 h-4" />,
      countHint: textContent ? 'Ready' : undefined,
    },
    {
      id: 'image',
      label: 'Image / Screenshot',
      icon: <ImageIcon className="w-4 h-4" />,
      countHint: imageFile ? '1 image' : undefined,
    },
    {
      id: 'url',
      label: 'Website / URL',
      icon: <Globe className="w-4 h-4" />,
      countHint: urlContent ? 'Ready' : undefined,
    },
    {
      id: 'document',
      label: 'Document / PDF',
      icon: <FileText className="w-4 h-4" />,
      countHint: documentFile ? '1 file' : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Scanner Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-700/60 bg-slate-900/70">
        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setValidationError(null);
                }}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 shadow-md border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.countHint && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {tab.countHint}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="min-h-[220px]">
          {activeTab === 'image' && (
            <ImageDropzone imageFile={imageFile} onImageSelected={setImageFile} />
          )}

          {activeTab === 'text' && (
            <TextInputMode
              text={textContent}
              onTextChange={setTextContent}
              redactPii={redactPii}
              onRedactPiiChange={setRedactPii}
            />
          )}

          {activeTab === 'url' && (
            <UrlInputMode url={urlContent} onUrlChange={setUrlContent} />
          )}

          {activeTab === 'document' && (
            <DocInputMode
              documentFile={documentFile}
              onDocumentSelected={setDocumentFile}
            />
          )}
        </div>

        {/* Error notification if validation fails */}
        {validationError && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 animate-in fade-in duration-150">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Primary CTA Action Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Zero-knowledge server analysis. Content is analyzed defensively without storing credentials.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              onClick={handleAnalyze}
              leftIcon={<Sparkles className="w-5 h-5 text-white" />}
              className="w-full sm:w-auto px-8 shadow-glow-cyan"
            >
              Analyze Safely
            </Button>
          </div>
        </div>
      </div>

      {/* Preset Scenarios Carousel / Quick-loader */}
      <PresetPicker onSelectPreset={handleSelectPreset} />
    </div>
  );
}
