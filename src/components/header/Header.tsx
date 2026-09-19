'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, BookOpen, History, Settings, Cpu } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

interface HeaderProps {
  activeTab: 'scan' | 'tactics' | 'history';
  onTabChange: (tab: 'scan' | 'tactics' | 'history') => void;
  historyCount: number;
}

export function Header({ activeTab, onTabChange, historyCount }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [providerName, setProviderName] = useState<string>('TrustLens Engine');

  useEffect(() => {
    fetch('/api/analyze')
      .then((res) => res.json())
      .then((data) => {
        if (data.provider?.name) {
          setProviderName(data.provider.name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('scan')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/20 text-white">
              <Shield className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-wider text-white">TRUSTLENS</h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  AI Safety
                </span>
              </div>
              <p className="text-xs text-slate-400 tracking-wide">
                &ldquo;Pause. Scan. Know.&rdquo;
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('scan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'scan'
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Scanner</span>
            </button>

            <button
              onClick={() => onTabChange('tactics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'tactics'
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Tactics Library</span>
              <span className="sm:hidden">Tactics</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors relative ${
                activeTab === 'history'
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Provider status & Settings button */}
            <div className="ml-1 pl-2 border-l border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                title={`Engine: ${providerName}. Click to configure.`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-all text-xs"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline font-mono text-[11px] max-w-[130px] truncate">
                  {providerName.replace('Provider', '')}
                </span>
                <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
