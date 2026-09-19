'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header/Header';
import { SmartScanner } from '@/components/scanner/SmartScanner';
import { ScanningProgress } from '@/components/scanner/ScanningProgress';
import { AnalysisResultView } from '@/components/results/AnalysisResultView';
import { ScanHistoryDrawer } from '@/components/history/ScanHistoryDrawer';
import { TacticsAcademy } from '@/components/education/TacticsAcademy';
import { TrustLensAnalysis, AnalysisRequest } from '@/lib/ai/types';
import { Shield, Sparkles, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'trustlens_history_v1';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'scan' | 'tactics' | 'history'>('scan');
  const [currentAnalysis, setCurrentAnalysis] = useState<TrustLensAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [history, setHistory] = useState<TrustLensAnalysis[]>([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read history from localStorage', e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (item: TrustLensAnalysis) => {
    try {
      const updated = [item, ...history.filter((h) => h.timestamp !== item.timestamp)].slice(0, 50);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleDeleteHistoryItem = (timestamp: string) => {
    const updated = history.filter((h) => h.timestamp !== timestamp);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Perform Analysis
  const handleStartAnalysis = async (request: AnalysisRequest) => {
    setIsLoading(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.analysis) {
        throw new Error(data.error || 'Failed to complete analysis.');
      }

      setCurrentAnalysis(data.analysis);
      // Auto-save to local history
      saveToHistory(data.analysis);
      // Ensure we are in scan view
      setActiveTab('scan');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(
        err?.message || 'An unexpected network error occurred while communicating with the analysis engine.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setAnalysisError(null);
    setActiveTab('scan');
  };

  const handleSelectFromHistory = (item: TrustLensAnalysis) => {
    setCurrentAnalysis(item);
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col cyber-grid">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setAnalysisError(null);
        }}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Section (only visible on initial scan state) */}
        {activeTab === 'scan' && !currentAnalysis && !isLoading && (
          <div className="text-center space-y-4 py-4 sm:py-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multimodal AI Digital Safety Assistant</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Pause. Scan. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Know.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Don&apos;t just guess if a message is genuine. TrustLens reveals observable risk signals, identifies unverified claims, and guides you with safe, actionable next steps.
            </p>

            {/* Value Props Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Evidence-First Evaluation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Screenshots, Text &amp; URLs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>Client-Side PII Redaction</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {analysisError && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs sm:text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Analysis Notice</p>
              <p className="text-red-300">{analysisError}</p>
            </div>
          </div>
        )}

        {/* View Router */}
        {activeTab === 'scan' && (
          <>
            {isLoading ? (
              <div className="glass-panel rounded-3xl p-8 border border-slate-800 bg-slate-900/60">
                <ScanningProgress />
              </div>
            ) : currentAnalysis ? (
              <AnalysisResultView
                analysis={currentAnalysis}
                onReset={handleReset}
                onSaveToHistory={saveToHistory}
                isSaved={true}
              />
            ) : (
              <SmartScanner
                onStartAnalysis={handleStartAnalysis}
                isLoading={isLoading}
              />
            )}
          </>
        )}

        {activeTab === 'tactics' && <TacticsAcademy />}

        {activeTab === 'history' && (
          <ScanHistoryDrawer
            history={history}
            onSelectAnalysis={handleSelectFromHistory}
            onClearHistory={handleClearHistory}
            onDeleteItem={handleDeleteHistoryItem}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-300">TRUSTLENS</span>
            <span>— &ldquo;Pause. Scan. Know.&rdquo;</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Evidence-based digital safety. Built for defensive awareness.
          </p>
        </div>
      </footer>
    </div>
  );
}
