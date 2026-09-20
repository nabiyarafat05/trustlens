'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, BookOpen, History, Settings, Cpu, Menu, X } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

interface HeaderProps {
  activeTab: 'scan' | 'tactics' | 'history';
  onTabChange: (tab: 'scan' | 'tactics' | 'history') => void;
  historyCount: number;
}

export function Header({ activeTab, onTabChange, historyCount }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <div className="relative max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Tagline */}
          <button
            type="button"
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
            onClick={() => {
              onTabChange('scan');
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/20 text-white shrink-0">
              <Shield className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-base sm:text-lg font-bold tracking-wider text-white">TRUSTLENS</h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  AI Safety
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 tracking-wide">
                &ldquo;Pause. Scan. Know.&rdquo;
              </p>
            </div>
          </button>

          {/* Navigation Controls */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
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

          <div className="flex sm:hidden items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open engine settings"
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="absolute left-3 right-3 top-[calc(100%+0.5rem)] sm:hidden rounded-2xl border border-slate-700 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-md">
              {[
                { id: 'scan' as const, label: 'Scanner', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
                { id: 'tactics' as const, label: 'Tactics Library', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
                { id: 'history' as const, label: 'History', icon: <History className="w-4 h-4 text-emerald-400" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    activeTab === item.id ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'history' && historyCount > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {historyCount}
                    </span>
                  )}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left text-slate-300 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Engine settings</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
