'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Zap, Sparkles, Code2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Profile } from '../../types';

interface AboutSectionProps {
  profile?: Profile | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const longBio =
    profile?.longBio ||
    'With over 8 years of full-stack engineering expertise, I specialize in architecting high-performance digital platforms using Next.js 15, TypeScript, Node.js, and PostgreSQL. I have architected systems processing millions of daily transactions, led multi-disciplinary agile squads, and built intuitive user interfaces with clean architecture and meticulous attention to UX.';

  const highlights = [
    {
      title: 'Architectural Resilience',
      desc: 'Designing fault-tolerant distributed systems with horizontal scaling, database replication, and zero single points of failure.',
      icon: Shield,
    },
    {
      title: 'End-to-End Type Safety',
      desc: 'Enforcing strict type contracts from PostgreSQL schema (Prisma) through API layers (Zod) to React components (TypeScript).',
      icon: Zap,
    },
    {
      title: 'High-Impact Performance',
      desc: 'Targeting sub-100ms API response times and pristine 100/100 Core Web Vitals through edge caching and selective hydration.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-[#00007B]/10 relative">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono mb-3">
                <Code2 className="w-3.5 h-3.5" />
                <span>Engineering Philosophy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight">
                Software Built for Purpose, Precision &amp; Longevity
              </h2>
            </div>

            <p className="text-[#00007B]/85 leading-relaxed text-base sm:text-lg font-normal">
              {longBio}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0F9A73] shrink-0 mt-0.5" />
                <span className="text-sm text-[#00007B]/80">
                  Staff-level experience migrating monolithic codebases into modular, event-driven microservices.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0F9A73] shrink-0 mt-0.5" />
                <span className="text-sm text-[#00007B]/80">
                  Obsession with Core Web Vitals, memory profiling, and accessible WCAG AA standards.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0F9A73] shrink-0 mt-0.5" />
                <span className="text-sm text-[#00007B]/80">
                  Deep belief in automated integration testing, comprehensive documentation, and developer DX.
                </span>
              </div>
            </div>

            <div className="pt-3">
              <Link href="/about">
                <Button variant="outline" size="md" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
                  <span>Read Full Engineering Background</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-[#0F9A73]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Three Architectural Pillars */}
          <div className="lg:col-span-6 space-y-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#f8fafd] border border-[#00007B]/15 p-6 rounded-2xl flex items-start gap-5 hover:border-[#0F9A73] hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0F9A73]/15 border border-[#0F9A73]/30 flex items-center justify-center text-[#0F9A73] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#00007B] mb-1">{item.title}</h3>
                    <p className="text-sm text-[#00007B]/75 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
