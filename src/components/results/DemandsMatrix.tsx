'use client';

import React from 'react';
import { RequestsDetected } from '@/lib/ai/types';
import {
  CreditCard,
  KeyRound,
  Lock,
  User,
  FileBadge,
  Building2,
  Clock,
  Laptop,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface DemandsMatrixProps {
  requests: RequestsDetected;
}

export function DemandsMatrix({ requests }: DemandsMatrixProps) {
  const items: {
    key: keyof RequestsDetected;
    label: string;
    icon: React.ReactNode;
    detected: boolean;
    warningDesc: string;
  }[] = [
    {
      key: 'urgentAction',
      label: 'Urgent Action / Deadline',
      icon: <Clock className="w-4 h-4" />,
      detected: Boolean(requests.urgentAction),
      warningDesc: 'Forces immediate response without contemplation',
    },
    {
      key: 'otp',
      label: 'One-Time Passcode (OTP)',
      icon: <KeyRound className="w-4 h-4" />,
      detected: Boolean(requests.otp),
      warningDesc: 'Attempts 2FA account takeover',
    },
    {
      key: 'password',
      label: 'Password / PIN',
      icon: <Lock className="w-4 h-4" />,
      detected: Boolean(requests.password),
      warningDesc: 'Direct credential harvesting',
    },
    {
      key: 'payment',
      label: 'Direct Payment / Wire',
      icon: <CreditCard className="w-4 h-4" />,
      detected: Boolean(requests.payment),
      warningDesc: 'Financial transfer or unverified fee',
    },
    {
      key: 'personalInformation',
      label: 'Personal Data (PII)',
      icon: <User className="w-4 h-4" />,
      detected: Boolean(requests.personalInformation),
      warningDesc: 'Name, address, contact profiling',
    },
    {
      key: 'identityDocument',
      label: 'Identity Document (SSN/ID)',
      icon: <FileBadge className="w-4 h-4" />,
      detected: Boolean(requests.identityDocument),
      warningDesc: 'Full identity theft risk',
    },
    {
      key: 'bankInformation',
      label: 'Banking / Card Numbers',
      icon: <Building2 className="w-4 h-4" />,
      detected: Boolean(requests.bankInformation),
      warningDesc: 'Financial account compromise',
    },
    {
      key: 'remoteAccess',
      label: 'Remote Computer Access',
      icon: <Laptop className="w-4 h-4" />,
      detected: Boolean(requests.remoteAccess),
      warningDesc: 'Full machine takeover threat',
    },
  ];

  const detectedCount = items.filter((i) => i.detected).length;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            Detected Demands & Solicitations
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            What is this communication asking you to provide or do?
          </p>
        </div>

        {detectedCount > 0 ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40">
            {detectedCount} high-risk demand{detectedCount > 1 ? 's' : ''} detected
          </span>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
            No sensitive solicitations detected
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {items.map((item) => {
          return (
            <div
              key={item.key}
              className={`p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between space-y-2 ${
                item.detected
                  ? 'bg-red-950/40 border-red-500/40 text-red-200 shadow-sm shadow-red-950'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-1.5 rounded-lg ${
                    item.detected
                      ? 'bg-red-900/60 text-red-300'
                      : 'bg-slate-800/60 text-slate-500'
                  }`}
                >
                  {item.icon}
                </div>
                {item.detected ? (
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
                )}
              </div>

              <div>
                <p
                  className={`text-xs font-medium line-clamp-1 ${
                    item.detected ? 'text-red-100 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`text-[10px] mt-0.5 ${
                    item.detected ? 'text-red-300/80 font-medium' : 'text-slate-600'
                  }`}
                >
                  {item.detected ? item.warningDesc : 'Not detected'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
