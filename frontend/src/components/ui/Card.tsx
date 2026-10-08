import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'outline';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default:
        'bg-white dark:bg-[#111827] border border-[#00007B]/15 dark:border-white/10 text-[#00007B] dark:text-slate-100 rounded-2xl p-6 shadow-sm transition-all',
      glass:
        'bg-white/90 dark:bg-[#111827]/80 backdrop-blur-md border border-[#00007B]/15 dark:border-white/10 text-[#00007B] dark:text-slate-100 rounded-2xl p-6 shadow-md transition-all',
      interactive:
        'bg-white dark:bg-[#111827] border border-[#00007B]/15 dark:border-white/10 hover:border-[#0F9A73]/60 hover:shadow-glow transition-all duration-300 text-[#00007B] dark:text-slate-100 rounded-2xl p-6 group cursor-pointer',
      outline:
        'bg-transparent border border-[#00007B]/20 dark:border-white/15 text-[#00007B] dark:text-slate-100 rounded-2xl p-6 transition-all',
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
