'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ExternalLink, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Globe 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CareerOpportunity } from '../../types';

interface CareerSectionProps {
  opportunities: CareerOpportunity[];
}

export const CareerSection: React.FC<CareerSectionProps> = ({ opportunities }) => {
  return (
    <section className="py-24 bg-white border-t border-[#00007B]/10 relative">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Recruiter Kit Banner */}
        <div className="bg-[#00007B] border border-[#0F9A73]/40 rounded-3xl p-8 sm:p-10 mb-16 relative overflow-hidden shadow-xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/20 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recruiter &amp; Talent Portal</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Open to High-Impact Opportunities
              </h2>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                Actively evaluating Senior, Staff, and Principal Full-Stack Engineer positions, Cloud Architecture roles, and strategic technical consulting contracts worldwide.
              </p>

              {/* Recruiter Quick Sheet Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-white">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <Globe className="w-4 h-4 text-[#0F9A73] shrink-0" />
                  <span>US Citizen • Remote</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <Clock className="w-4 h-4 text-[#0F9A73] shrink-0" />
                  <span>Immediate / 2 Wks</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-[#0F9A73] shrink-0" />
                  <span>Full-Time &amp; C2C</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center lg:items-end">
              <Link href="/career" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto justify-center bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
                  <span>Browse Target Positions</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto justify-center border-white/30 text-white hover:bg-white/10">
                  <span>Schedule Recruiter Chat</span>
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#00007B]/10">
            <h3 className="text-xl font-bold text-[#00007B] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#0F9A73]" />
              <span>Target Roles &amp; Official Openings</span>
            </h3>
            <span className="text-xs font-mono text-[#00007B]/70">
              Verified Official Job Links ({opportunities.length} roles)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white border border-[#00007B]/15 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-xl transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-[#00007B] group-hover:text-[#0F9A73] transition-colors leading-tight">
                        {opp.jobTitle}
                      </h4>
                      <p className="text-xs font-semibold text-[#0F9A73] mt-1.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {opp.companyName}
                      </p>
                    </div>
                    <Badge variant={opp.remoteType === 'Remote' ? 'emerald' : 'cyan'} size="sm">
                      {opp.remoteType}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#00007B]/80 line-clamp-3 leading-relaxed mb-4">
                    {opp.jobDescription}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#00007B]/70 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F9A73]" />
                      {opp.location}
                    </span>
                    {opp.salaryRange && (
                      <span className="text-[#0F9A73] font-bold">{opp.salaryRange}</span>
                    )}
                  </div>

                  {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-6">
                      {opp.requiredSkills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#f8fafd] text-[#00007B] border border-[#00007B]/15"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#00007B]/10">
                  <a
                    href={opp.applicationUrl || opp.careerUrl || opp.jobUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full block"
                  >
                    <Button variant="primary" size="sm" className="w-full justify-center bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
                      <span>Apply on Official Site</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
