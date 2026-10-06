import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#0F9A73]/20 animate-ping" />
        <div className="w-12 h-12 rounded-full border-2 border-[#0F9A73] border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-mono text-[#00007B] font-bold mt-4 tracking-wider uppercase">Loading Platform...</p>
    </div>
  );
}
