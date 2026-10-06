'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Award, Star, ExternalLink, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { Achievement } from '../../types';
import { formatDate } from '../../lib/utils';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    api.getAchievements().then(setAchievements).catch(console.error);
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    Trophy: <Trophy className="w-6 h-6 text-amber-500" />,
    Award: <Award className="w-6 h-6 text-[#0F9A73]" />,
    Star: <Star className="w-6 h-6 text-[#0F9A73]" />,
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
          <Badge variant="cyan">Milestones</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight mt-2">
            Honors &amp; Achievements
          </h1>
          <p className="text-[#00007B]/70 text-sm sm:text-base mt-2 max-w-2xl font-normal">
            Recognition from industry hackathons, speaking engagements, and open-source software contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white border border-[#00007B]/15 p-8 rounded-3xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-xl transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F9A73]/10 border border-[#0F9A73]/20 flex items-center justify-center shrink-0">
                    {iconMap[ach.icon || 'Trophy'] || <Trophy className="w-6 h-6 text-[#0F9A73]" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#00007B] leading-tight">{ach.title}</h2>
                    {ach.organization && (
                      <p className="text-xs font-mono text-[#0F9A73] mt-1 font-semibold">{ach.organization}</p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#00007B]/80 leading-relaxed mb-6 font-normal">
                  {ach.description}
                </p>

                {ach.date && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#00007B]/70 mb-4">
                    <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span>{formatDate(ach.date)}</span>
                  </div>
                )}
              </div>

              {ach.url && (
                <div className="pt-4 border-t border-[#00007B]/10">
                  <a
                    href={ach.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9A73] hover:text-[#00007B] transition-colors"
                  >
                    <span>View Official Announcement</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
