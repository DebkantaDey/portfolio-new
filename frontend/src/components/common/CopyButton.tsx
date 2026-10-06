'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  showFeedback?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label,
  className = '',
  showFeedback = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md transition-all border border-white/10 hover:border-cyan/40 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white ${className}`}
      title={`Copy "${text}"`}
      aria-label={label || `Copy ${text}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {showFeedback && <span className="text-emerald-400 font-medium">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
