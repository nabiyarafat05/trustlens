import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'none' | 'cyan' | 'trust' | 'alert';
  interactive?: boolean;
}

export function Card({
  children,
  className = '',
  glow = 'none',
  interactive = false,
  ...props
}: CardProps) {
  const glowClasses = {
    none: '',
    cyan: 'border-cyan-500/30 shadow-glow-cyan',
    trust: 'border-emerald-500/30 shadow-glow-trust',
    alert: 'border-red-500/30 shadow-glow-alert',
  }[glow];

  const baseClass = interactive ? 'glass-panel-interactive' : 'glass-panel';

  return (
    <div
      className={`rounded-2xl p-5 text-slate-100 ${baseClass} ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
