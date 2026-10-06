import React from 'react';
import Link from 'next/link';
import { Trophy, Award, Star, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Achievement } from '../../types';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Trophy: <Trophy className="w-5 h-5 text-amber-500" />,
    Award: <Award className="w-5 h-5 text-[#0F9A73]" />,
    Star: <Star className="w-5 h-5 text-[#0F9A73]" />,
  };

  return (
    <section className="py-20 bg-[#f8fafd] border-t border-[#00007B]/10">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs uppercase font-mono tracking-widest text-[#0F9A73] font-bold">Honors &amp; Milestones</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight mt-1">
              Key Achievements &amp; Recognition
            </h2>
          </div>
          <Link href="/achievements">
            <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
              <span>View All Achievements</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#0F9A73]" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white border border-[#00007B]/15 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0F9A73]/10 border border-[#0F9A73]/20 flex items-center justify-center shrink-0">
                    {iconMap[ach.icon || 'Trophy'] || <Trophy className="w-5 h-5 text-[#0F9A73]" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#00007B] leading-snug">{ach.title}</h3>
                    {ach.organization && (
                      <p className="text-xs text-[#0F9A73] font-mono mt-0.5 font-semibold">{ach.organization}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#00007B]/80 leading-relaxed mb-4">{ach.description}</p>
              </div>

              {ach.url && (
                <div className="pt-4 border-t border-[#00007B]/10">
                  <a
                    href={ach.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9A73] hover:text-[#00007B] transition-colors"
                  >
                    <span>Learn More</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
