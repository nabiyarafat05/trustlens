'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Clipboard, AlertCircle } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { Button } from '../ui/Button';

interface ImageDropzoneProps {
  imageFile: {
    dataUri: string;
    mimeType: string;
    fileName: string;
    fileSize: number;
    extractedText?: string;
    extractedText?: string;
  } | null;
  onImageSelected: (image: {
    dataUri: string;
    mimeType: string;
    fileName: string;
    fileSize: number;
  } | null) => void;
}

export function ImageDropzone({ imageFile, onImageSelected }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (PNG, JPG, WEBP, or GIF).');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        if (result) {
          let extractedText = '';
          try {
            const worker = await createWorker('eng');
            const ocrResult = await worker.recognize(result);
            extractedText = ocrResult.data.text.trim();
            await worker.terminate();
          } catch (ocrError) {
            console.warn('Could not extract text from image:', ocrError);
          }

          onImageSelected({
            dataUri: result,
            mimeType: file.type,
            fileName: file.name,
            fileSize: file.size,
            extractedText,
          });
        }
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  // Global clipboard paste listener (Ctrl+V for screenshot)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {!imageFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
              : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 mb-4 shadow-sm shadow-cyan-950">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-base font-semibold text-slate-200 mb-1">
            Drop screenshot or image here
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Drag & drop, click to browse, or simply press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-cyan-300">Ctrl + V</kbd> to paste a clipboard screenshot.
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<ImageIcon className="w-4 h-4 text-cyan-400" />}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select Image File
            </Button>

            <span className="text-slate-600 text-xs">or</span>

            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <Clipboard className="w-3.5 h-3.5 text-slate-400" />
              Paste from Clipboard
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            Supports PNG, JPG, WEBP up to 10MB. Content stays private.
          </p>
        </div>
      ) : (
        /* Image Preview State */
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {imageFile.fileName}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {formatBytes(imageFile.fileSize)} • {imageFile.mimeType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </Button>
              <button
                type="button"
                onClick={() => onImageSelected(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative max-h-72 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageFile.dataUri}
              alt="Content preview"
              className="max-h-72 w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
