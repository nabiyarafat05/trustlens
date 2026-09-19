import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'trust' | 'caution' | 'alert' | 'critical' | 'cyan' | 'purple' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}: BadgeProps) {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  }[size];

  const variantClasses = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    trust: 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950',
    caution: 'bg-amber-950/70 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950',
    alert: 'bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-sm shadow-orange-950',
    critical: 'bg-red-950/80 text-red-300 border border-red-500/50 shadow-sm shadow-red-950 animate-pulse',
    cyan: 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40',
    purple: 'bg-purple-950/70 text-purple-300 border border-purple-500/40',
    outline: 'bg-transparent text-slate-400 border border-slate-700',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
