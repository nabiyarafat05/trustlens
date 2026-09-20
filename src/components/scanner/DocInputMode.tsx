'use client';

import React, { useRef, useState } from 'react';
import { FileText, UploadCloud, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface DocInputModeProps {
  documentFile: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    textPreview?: string;
  } | null;
  onDocumentSelected: (doc: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    textPreview?: string;
  } | null) => void;
}

export function DocInputMode({ documentFile, onDocumentSelected }: DocInputModeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.match(/\.(pdf|txt|eml|msg)$/i)) {
      setError('Please select a PDF, TXT, or email message file (.eml, .msg).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Document size must be less than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const textContent = (e.target?.result as string) || '';
      onDocumentSelected({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
        textPreview: textContent.slice(0, 1000), // First 1000 characters
      });
    };
    reader.onerror = () => {
      setError('Could not read document contents.');
    };

    // Read as text or data
    if (file.name.endsWith('.txt') || file.name.endsWith('.eml')) {
      reader.readAsText(file);
    } else {
      // For PDF, read preview name
      onDocumentSelected({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
        textPreview: `[PDF Document: ${file.name} - ${Math.round(file.size / 1024)} KB]`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.eml,.msg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {!documentFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-900/60 transition-all cursor-pointer text-center"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 mb-4 shadow-sm shadow-cyan-950">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-base font-semibold text-slate-200 mb-1">
            Upload suspicious document or PDF
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Upload PDF invoices, account notices, or exported email files (.eml) for risk evaluation.
          </p>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<FileText className="w-4 h-4 text-cyan-400" />}
          >
            Select Document
          </Button>

          <p className="text-[11px] text-slate-500 mt-4">
            Supports PDF, TXT, EML up to 8MB.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {documentFile.fileName}
                </p>
                <p className="text-xs text-slate-400">
                  {(documentFile.fileSize / 1024).toFixed(1)} KB • Ready for analysis
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDocumentSelected(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {documentFile.textPreview && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 font-mono line-clamp-3 break-words">
              {documentFile.textPreview}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
