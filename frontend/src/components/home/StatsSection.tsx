'use client';

import React from 'react';
import { Briefcase, Code2, Layers, ShieldCheck, TrendingUp } from 'lucide-react';
import { Statistic } from '../../types';

interface StatsSectionProps {
  stats?: Statistic[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const defaultStats = [
    { id: '1', label: 'Years in Production', value: '8+', icon: 'Briefcase', subtext: 'Staff & Lead engineering' },
    { id: '2', label: 'Systems Shipped', value: '45+', icon: 'Code', subtext: 'Fintech, SaaS & AI web apps' },
    { id: '3', label: 'Production Uptime', value: '99.98%', icon: 'ShieldCheck', subtext: 'Multi-region architectures' },
    { id: '4', label: 'GitHub Contributions', value: '2,400+', icon: 'Layers', subtext: 'Annual commits & OSS' },
  ];

  const items = stats && stats.length > 0 ? stats : defaultStats;

  const iconMap: Record<string, React.ReactNode> = {
    Briefcase: <Briefcase className="w-5 h-5 text-[#0F9A73]" />,
    Code: <Code2 className="w-5 h-5 text-[#0F9A73]" />,
    Layers: <Layers className="w-5 h-5 text-[#0F9A73]" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#0F9A73]" />,
  };

  return (
    <section className="py-14 bg-white border-b border-[#00007B]/10 relative">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((stat, idx) => {
            const sub = (stat as any).subtext || 'Verified production metric';
            return (
              <div
                key={stat.id || idx}
                className="bg-white border border-[#00007B]/15 p-5 sm:p-6 rounded-2xl flex flex-col items-start justify-between relative overflow-hidden group hover:border-[#0F9A73] hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F9A73]/10 border border-[#0F9A73]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {iconMap[stat.icon || 'Briefcase'] || <Briefcase className="w-5 h-5 text-[#0F9A73]" />}
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#0F9A73]" />
                </div>

                <div>
                  <span className="block text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight font-mono">
                    {stat.value}
                  </span>
                  <span className="block text-xs sm:text-sm text-[#00007B] mt-1 font-bold">
                    {stat.label}
                  </span>
                  <span className="block text-[11px] text-[#00007B]/70 font-mono mt-0.5">
                    {sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
