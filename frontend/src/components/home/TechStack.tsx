'use client';

import React from 'react';
import { Layers, Terminal, Sparkles } from 'lucide-react';

const technologies = [
  { name: 'Next.js 15', category: 'App Router', highlight: true },
  { name: 'TypeScript 5', category: 'Strict Types', highlight: true },
  { name: 'React 19', category: 'Concurrent UI', highlight: false },
  { name: 'Node.js', category: 'Backend Engine', highlight: false },
  { name: 'PostgreSQL 16', category: 'Relational DB', highlight: true },
  { name: 'Prisma ORM', category: 'Type-Safe Data', highlight: false },
  { name: 'Docker', category: 'Containers', highlight: true },
  { name: 'Tailwind CSS', category: 'Design System', highlight: false },
  { name: 'Redis', category: 'Distributed Cache', highlight: false },
  { name: 'AWS Cloud', category: 'Infrastructure', highlight: true },
];

export const TechStack: React.FC = () => {
  return (
    <section className="py-10 border-y border-[#00007B]/10 bg-[#f8fafd]">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F9A73] inline-block animate-pulse" />
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#00007B] font-bold">
              Production Verified Stack (2026)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#0F9A73] font-bold bg-[#0F9A73]/10 px-2.5 py-1 rounded-full border border-[#0F9A73]/20">
            System Theme: #00007B • #fff • #0F9A73
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col items-start justify-center group ${
                tech.highlight
                  ? 'bg-white border-2 border-[#0F9A73] shadow-sm hover:border-[#0F9A73] hover:shadow-md'
                  : 'bg-white border border-[#00007B]/15 hover:border-[#00007B]/40 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-[#00007B] group-hover:text-[#0F9A73] transition-colors">
                  {tech.name}
                </span>
                {tech.highlight && (
                  <span className="w-2 h-2 rounded-full bg-[#0F9A73]" />
                )}
              </div>
              <span className="text-[10px] text-[#00007B]/70 font-mono mt-0.5">{tech.category}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
