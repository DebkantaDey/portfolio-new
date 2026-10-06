'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, Sparkles, CheckCircle2, Cpu, Code2, Database, Cloud } from 'lucide-react';
import { Button } from '../ui/Button';
import { TechIcon } from '../common/TechIcon';
import { Skill } from '../../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills =
    activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  const getTierLabel = (proficiency: number) => {
    if (proficiency >= 90) return { label: 'Staff / Expert', color: 'text-[#0F9A73] bg-[#0F9A73]/15 border-[#0F9A73]/40' };
    if (proficiency >= 80) return { label: 'Advanced Core', color: 'text-[#00007B] bg-[#00007B]/10 border-[#00007B]/20' };
    return { label: 'Production Proficient', color: 'text-[#00007B]/80 bg-[#00007B]/5 border-[#00007B]/15' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Code2 className="w-4 h-4 text-[#0F9A73]" />;
      case 'backend':
        return <Cpu className="w-4 h-4 text-[#0F9A73]" />;
      case 'database':
        return <Database className="w-4 h-4 text-[#0F9A73]" />;
      case 'devops':
      case 'cloud':
        return <Cloud className="w-4 h-4 text-emerald-600" />;
      default:
        return <Wrench className="w-4 h-4 text-[#0F9A73]" />;
    }
  };

  return (
    <section className="py-24 bg-[#f8fafd] border-t border-[#00007B]/10 relative">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical Domain Mastery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight">
              Ecosystem &amp; Production Tooling
            </h2>
            <p className="text-sm sm:text-base text-[#00007B]/80 mt-2 max-w-2xl">
              Battle-tested tools and frameworks utilized across high-traffic distributed microservices and modern frontend architectures.
            </p>
          </div>

          <Link href="/skills">
            <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
              <span>View Full Taxonomy</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#0F9A73]" />
            </Button>
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeCategory === cat
                  ? 'bg-[#0F9A73] text-white font-bold shadow-md'
                  : 'bg-white border border-[#00007B]/15 text-[#00007B]/80 hover:text-[#00007B] hover:border-[#00007B]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.slice(0, 9).map((skill) => {
            const tier = getTierLabel(skill.proficiency);
            return (
              <div
                key={skill.id}
                className="bg-white border border-[#00007B]/15 p-5 rounded-2xl hover:border-[#0F9A73] hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-1.5 shadow-inner group-hover:scale-105 group-hover:border-[#0F9A73] transition-all shrink-0">
                        {skill.icon ? (
                          <TechIcon name={skill.icon} size={22} />
                        ) : (
                          getCategoryIcon(skill.category)
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#00007B] group-hover:text-[#0F9A73] transition-colors">
                          {skill.name}
                        </h3>
                        <span className="text-[11px] font-mono text-[#00007B]/60">{skill.category}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tier.color}`}>
                      {tier.label}
                    </span>
                  </div>

                  {skill.description && (
                    <p className="text-xs text-[#00007B]/75 mb-4 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  )}
                </div>

                {/* Practical Experience Footer */}
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
    </section>
  );
};
