import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-[#0F9A73] text-white font-semibold hover:bg-[#12b88a] hover:shadow-glow focus:ring-[#0F9A73]',
      secondary:
        'bg-[#00007B] text-white hover:bg-[#000099] border border-white/20 focus:ring-[#0F9A73]',
      outline:
        'border border-[#0F9A73]/50 text-[#0F9A73] hover:bg-[#0F9A73]/15 hover:border-[#0F9A73] focus:ring-[#0F9A73]',
      ghost:
        'text-[#00007B]/80 hover:text-[#00007B] hover:bg-[#00007B]/10 focus:ring-[#0F9A73]',
      danger:
        'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
