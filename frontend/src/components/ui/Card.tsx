import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'outline';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-navy-900/90 border border-navy-800 text-slate-100 rounded-2xl p-6 shadow-sm',
      glass:
        'bg-navy-900/60 backdrop-blur-md border border-navy-700/60 text-slate-100 rounded-2xl p-6 shadow-md',
      interactive:
        'bg-navy-900/90 border border-navy-800 hover:border-cyan/50 hover:shadow-glow transition-all duration-300 text-slate-100 rounded-2xl p-6 group cursor-pointer',
      outline: 'bg-transparent border border-navy-800 text-slate-100 rounded-2xl p-6',
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
