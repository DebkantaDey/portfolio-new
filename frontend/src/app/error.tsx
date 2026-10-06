'use client';

import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-center text-rose-600 mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-bold">Runtime Error</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight mt-2">
        Something Went Wrong
      </h1>
      <p className="text-[#00007B]/70 text-sm max-w-md mt-3 leading-relaxed">
        An unexpected error occurred while rendering this page.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()} className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold">
          <RotateCcw className="w-4 h-4 mr-2" />
          <span>Try Again</span>
        </Button>
        <Link href="/">
          <Button variant="secondary" size="md" className="bg-[#00007B] text-white hover:bg-[#000052]">
            <Home className="w-4 h-4 mr-2" />
            <span>Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
