import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'slate' | 'navy' | 'emerald' | 'amber' | 'rose';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'cyan',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    cyan: 'bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30',
    slate: 'bg-[#00007B]/5 text-[#00007B]/80 border border-[#00007B]/15',
    navy: 'bg-[#00007B] text-white border border-white/20',
    emerald: 'bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30',
    amber: 'bg-amber-500/15 text-amber-700 border border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-700 border border-rose-500/30',
  };

  const sizes = {
    sm: 'text-[11px] font-medium px-2 py-0.5 rounded-md font-mono',
    md: 'text-xs font-medium px-2.5 py-1 rounded-full font-mono',
  };

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 font-medium select-none', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
