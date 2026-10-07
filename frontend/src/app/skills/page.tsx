'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Wrench, Sparkles, CheckCircle2, Cpu, Code2, Database, Cloud } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { TechIcon } from '../../components/common/TechIcon';
import { api } from '../../lib/api';
import { Skill } from '../../types';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSkills().then((res) => {
      const sorted = [...res].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      setSkills(sorted);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const sortedSkills = [...skills].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const categories = ['All', ...Array.from(new Set(sortedSkills.map((p) => p.category)))];

  const filtered = sortedSkills.filter((s) => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getTierLabel = (proficiency: number) => {
    if (proficiency >= 90) return { label: 'Staff / Expert', color: 'text-[#0F9A73] bg-[#0F9A73]/15 border-[#0F9A73]/40' };
    if (proficiency >= 80) return { label: 'Advanced Core', color: 'text-[#00007B] bg-[#00007B]/10 border-[#00007B]/20' };
    return { label: 'Production Proficient', color: 'text-[#00007B]/80 bg-[#00007B]/5 border-[#00007B]/15' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Code2 className="w-5 h-5 text-[#0F9A73]" />;
      case 'backend':
        return <Cpu className="w-5 h-5 text-[#0F9A73]" />;
      case 'database':
        return <Database className="w-5 h-5 text-[#0F9A73]" />;
      case 'devops':
      case 'cloud':
        return <Cloud className="w-5 h-5 text-emerald-600" />;
      default:
        return <Wrench className="w-5 h-5 text-[#0F9A73]" />;
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0F9A73] hover:underline font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div>
          <Badge variant="cyan">Technical Proficiencies</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight mt-2">
            Skills &amp; Technical Frameworks
          </h1>
          <p className="text-[#00007B]/70 text-sm sm:text-base mt-2 max-w-2xl font-normal">
            A comprehensive catalog of languages, libraries, databases, and DevOps tools leveraged in building production systems.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#00007B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills (e.g. Next.js, Docker)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-xs focus:outline-none focus:border-[#0F9A73] focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#0F9A73] text-white font-bold shadow-sm'
                    : 'bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B]/80 hover:text-[#00007B] hover:border-[#00007B]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((skill) => {
            const tier = getTierLabel(skill.proficiency);
            return (
              <div
                key={skill.id}
                className="bg-white border border-[#00007B]/15 p-6 rounded-2xl hover:border-[#0F9A73] hover:shadow-lg transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-1.5 shadow-inner shrink-0">
                        {skill.icon ? (
                          <TechIcon name={skill.icon} size={22} />
                        ) : (
                          getCategoryIcon(skill.category)
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#00007B]">{skill.name}</h3>
                        <span className="text-[11px] font-mono text-[#0F9A73] font-semibold">{skill.category}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tier.color}`}>
                      {tier.label}
                    </span>
                  </div>

                  {skill.description && (
                    <p className="text-xs text-[#00007B]/75 mb-4 leading-relaxed font-normal">
                      {skill.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#00007B]/10 flex items-center justify-between text-xs font-mono text-[#00007B]/70">
                  <span className="flex items-center gap-1.5 text-[#00007B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span>Production Verified</span>
                  </span>
                  <span className="text-[#0F9A73] text-[11px] font-bold">Active in 2026</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
