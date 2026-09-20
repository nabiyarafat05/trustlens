'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  ShieldAlert,
  Zap,
  PhoneCall,
  Package,
} from 'lucide-react';

interface TacticItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  howItWorks: string;
  realExample: string;
  whyPeopleFall: string;
  defenseTactic: string;
}

const TACTICS: TacticItem[] = [
  {
    id: 'urgency',
    title: 'Artificial Urgency',
    subtitle: 'The 30-Minute Threat',
    icon: <Clock className="w-5 h-5 text-amber-400" />,
    howItWorks:
      'The attacker establishes a strict artificial deadline ("within 24 hours", "in 30 minutes") accompanied by severe negative consequences (account closure, forfeiture of funds, legal action).',
    realExample:
      '"Your debit card has been locked due to unauthorized access. Confirm your credentials within 30 minutes or your account will be permanently deactivated."',
    whyPeopleFall:
      'Urgency triggers an acute physiological stress response (fight-or-flight), shifting cognitive processing away from analytical evaluation and towards panic compliance.',
    defenseTactic:
      'Pause immediately. High-pressure deadlines in digital messages are almost always synthetic. Legitimate financial institutions provide formal appeals processes, not 30-minute ultimatums.',
  },
  {
    id: 'authority',
    title: 'Authority Impersonation',
    subtitle: 'Borrowing Institutional Trust',
    icon: <ShieldAlert className="w-5 h-5 text-orange-400" />,
    howItWorks:
      'The attacker mimics a recognized institution with high societal authority—such as a major bank (Chase, Wells Fargo), government tax agency (IRS), law enforcement, or employer executive (CEO fraud).',
    realExample:
      '"[IRS Notice]: Direct deposit refund of $1,420 pending identity confirmation. Provide SSN and banking routing number."',
    whyPeopleFall:
      'People are conditioned to respect institutional authority to avoid penalties and comply with regulatory bodies.',
    defenseTactic:
      'Verify the apex domain. Independent search for the verified corporate contact number. Never dial numbers provided in unsolicited messages.',
  },
  {
    id: 'delivery',
    title: 'Package Delivery Smishing',
    subtitle: 'The "Unfinished Delivery" Lure',
    icon: <Package className="w-5 h-5 text-cyan-400" />,
    howItWorks:
      'Text messages claiming an undelivered parcel from USPS, FedEx, or DHL due to a missing street number or a tiny unpaid customs fee ($1.00 to $2.50).',
    realExample:
      '"USPS: Parcel #9400-1118 held at dispatch center due to incorrect address. Pay $1.85 redelivery surcharge: usps-redelivery.info"',
    whyPeopleFall:
      'Nearly everyone is regularly expecting online shipments, and the micro-fee ($1.85) feels too insignificant to be a scam.',
    defenseTactic:
      'Track directly on usps.com or fedex.com. Real postal carriers do not charge micro-fees via unsolicited text messages.',
  },
  {
    id: 'callback',
    title: 'Call-Back Phishing (BazaarCall)',
    subtitle: 'The Fake Invoice / Refund Trap',
    icon: <PhoneCall className="w-5 h-5 text-rose-400" />,
    howItWorks:
      'The victim receives an email receipt for an expensive renewal (e.g. $649 for Geek Squad or Norton). Instead of a link, it provides a toll-free customer support number to "dispute or cancel".',
    realExample:
      '"Thank you for purchasing Ultra Antivirus Pro for $649.99. If unauthorized, call our 24/7 dispute desk at 1-888-XXX-XXXX."',
    whyPeopleFall:
      'People fear losing $650 and immediately call the number. A friendly fraudulent operator instructs them to install remote software (AnyDesk) to "process a refund", then drains their bank account.',
    defenseTactic:
      'Never call telephone numbers provided on surprise receipts. Check your actual credit card or PayPal statement first.',
  },
  {
    id: 'task-scam',
    title: 'Advance-Fee Task & Crypto Scams',
    subtitle: 'Unrealistic Pay for Trivial Work',
    icon: <Zap className="w-5 h-5 text-emerald-400" />,
    howItWorks:
      'Recruiters on WhatsApp or Telegram offer $300-$600/day for liking videos or reviewing apps. After initial small payouts, the user is required to deposit money ("collateral / task unlock") to withdraw earnings.',
    realExample:
      '"Earn $500 daily optimizing product ratings. Fund $50 USDT to unlock your VIP commission multiplier."',
    whyPeopleFall:
      'The illusion of easy money combined with small initial "proof" payouts builds false confidence before the large theft.',
    defenseTactic:
      'No legitimate employer ever asks employees to pay money or cryptocurrency to perform work or withdraw wages.',
  },
];

export function TacticsAcademy() {
  const [selectedTactic, setSelectedTactic] = useState<TacticItem>(TACTICS[0]);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 space-y-3">
        <div className="flex items-center gap-2.5 text-cyan-400">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Deception Tactics Knowledge Base
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          The Anatomy of Social Engineering
        </h3>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Attackers rarely hack computers; they hack human emotions. Learn to recognize the psychological pressure levers used in fraudulent communications before you click.
        </p>
      </div>

      {/* Main Grid: Selector on left, Deep-dive on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Tactics Nav Menu */}
        <div className="md:col-span-4 space-y-2">
          {TACTICS.map((tactic) => {
            const isSelected = selectedTactic.id === tactic.id;
            return (
              <button
                key={tactic.id}
                onClick={() => setSelectedTactic(tactic)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/40 text-slate-100 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    isSelected ? 'bg-slate-900 border border-slate-700' : 'bg-slate-800/60'
                  }`}
                >
                  {tactic.icon}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-semibold text-slate-200 truncate">
                    {tactic.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 truncate">
                    {tactic.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Panel */}
        <div className="md:col-span-8 min-w-0 glass-panel rounded-3xl p-4 sm:p-7 border border-slate-800 space-y-5 bg-slate-900/60">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700">
              {selectedTactic.icon}
            </div>
            <div className="min-w-0">
              <h4 className="text-lg font-bold text-slate-100 break-words">
                {selectedTactic.title}
              </h4>
              <p className="text-xs text-cyan-400 font-medium">
                {selectedTactic.subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* How it works */}
            <div className="space-y-1.5">
              <h6 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                How the attack works
              </h6>
              <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                {selectedTactic.howItWorks}
              </p>
            </div>

            {/* Real Example */}
            <div className="space-y-1.5">
              <h6 className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
                Observable In-the-Wild Example
              </h6>
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 font-mono text-xs leading-relaxed break-words">
                {selectedTactic.realExample}
              </div>
            </div>

            {/* Psychological Hook */}
            <div className="space-y-1.5">
              <h6 className="font-semibold text-red-300 uppercase tracking-wider text-[11px]">
                Why it works on people
              </h6>
              <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                {selectedTactic.whyPeopleFall}
              </p>
            </div>

            {/* Safe Defense Rule */}
            <div className="space-y-1.5">
              <h6 className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">
                Defensive Countermeasure
              </h6>
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 leading-relaxed font-medium">
                ✓ {selectedTactic.defenseTactic}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
