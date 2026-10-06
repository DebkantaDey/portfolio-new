import React from 'react';
import Image from 'next/image';
import { ExternalLink, Lock, ShieldCheck } from 'lucide-react';

interface BrowserMockupProps {
  url?: string;
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  url = 'https://alexmorgan.dev',
  imageSrc,
  imageAlt = 'Project Preview',
  title,
  className = '',
  children,
}) => {
  return (
    <div className={`rounded-xl border border-[#00007B]/15 bg-white shadow-xl overflow-hidden flex flex-col ${className}`}>
      {/* Window Titlebar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#f0f4fc] border-b border-[#00007B]/10 select-none">
        {/* macOS Traffic Lights */}
        <div className="flex items-center gap-1.5 w-16">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-rose-600/40" />
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block border border-amber-500/40" />
          <span className="w-3 h-3 rounded-full bg-[#0F9A73] inline-block border border-[#0F9A73]/40" />
        </div>

        {/* Address / URL Bar */}
        <div className="flex-1 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-white border border-[#00007B]/15 rounded-md text-[11px] text-[#00007B] font-mono truncate shadow-xs">
            <Lock className="w-3 h-3 text-[#0F9A73] shrink-0" />
            <span className="text-[#00007B]/50 font-normal">https://</span>
            <span className="text-[#00007B] font-semibold truncate">{url.replace(/^https?:\/\//, '')}</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-end gap-2 w-16 text-[#00007B] text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0F9A73]" />
        </div>
      </div>

      {/* Window Viewport */}
      <div className="relative w-full aspect-video bg-[#f8fafd] overflow-hidden flex items-center justify-center">
        {children ? (
          children
        ) : imageSrc ? (
          <div className="relative w-full h-full group">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
          </div>
        ) : (
          <div className="text-center p-6 text-[#00007B]/60 font-mono text-xs">
            [Production Architecture Live Preview]
          </div>
        )}
      </div>
    </div>
  );
};
