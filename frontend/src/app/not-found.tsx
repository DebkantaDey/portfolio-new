import React from 'react';
import Link from 'next/link';
import { Terminal, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#00007B] flex items-center justify-center text-white shadow-md mb-6">
        <Terminal className="w-8 h-8 text-[#0F9A73]" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#0F9A73] font-bold">404 Exception</span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight mt-2">
        Page Not Found
      </h1>
      <p className="text-[#00007B]/70 text-sm max-w-md mt-3 leading-relaxed">
        The requested path does not exist on this portfolio server. It may have been archived or moved to a new route.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link href="/">
          <Button variant="primary" size="md" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold">
            <Home className="w-4 h-4 mr-2" />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
