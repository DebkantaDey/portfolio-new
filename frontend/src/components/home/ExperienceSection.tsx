'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Calendar, MapPin, CheckCircle2, ExternalLink, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import { TechIcon } from '../common/TechIcon';
import { Experience } from '../../types';
import { formatDate } from '../../lib/utils';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section className="py-24 bg-white border-t border-[#00007B]/10 relative">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career Trajectory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight">
              Work Experience &amp; Engineering Leadership
            </h2>
            <p className="text-sm sm:text-base text-[#00007B]/80 mt-2 max-w-2xl">
              Track record of architecting distributed web platforms, leading cross-functional squads, and delivering mission-critical software.
            </p>
          </div>

          <Link href="/experience">
            <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
              <span>View Full Career Timeline</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#0F9A73]" />
            </Button>
          </Link>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 md:pl-10 border-l-2 border-[#00007B]/15 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#0F9A73] flex items-center justify-center group-hover:scale-125 transition-transform shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#0F9A73]" />
              </div>

              {/* Experience Card */}
              <div className="bg-white border border-[#00007B]/15 p-6 sm:p-8 rounded-2xl hover:border-[#0F9A73] hover:shadow-xl transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-1.5 shadow-inner shrink-0 mt-0.5">
                      {exp.companyLogo ? (
                        <TechIcon name={exp.companyLogo} size={28} />
                      ) : (
                        <Building className="w-6 h-6 text-[#00007B]/40" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-[#00007B] group-hover:text-[#0F9A73] transition-colors">
                          {exp.jobTitle}
                        </h3>
                        {exp.currentlyWorking && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/40">
                            Active Leadership
                          </span>
                        )}
                      </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-sm font-bold text-[#00007B]">{exp.companyName}</span>
                      <span className="text-[#00007B]/40">•</span>
                      <span className="text-xs font-mono text-[#0F9A73] font-semibold">{exp.employmentType}</span>
                      {exp.companyWebsite && (
                        <a
                          href={exp.companyWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00007B]/60 hover:text-[#0F9A73] transition-colors"
                          title="Visit Company"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#00007B]/80 shrink-0">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f8fafd] border border-[#00007B]/10">
                      <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                      {formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f8fafd] border border-[#00007B]/10">
                      <MapPin className="w-3.5 h-3.5 text-[#0F9A73]" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#00007B]/85 leading-relaxed mb-6 font-normal">
                  {exp.description}
                </p>

                {/* Key Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-2.5 mb-6">
                    <h4 className="text-xs uppercase font-mono font-bold text-[#00007B]/70 tracking-wider">
                      Core Responsibilities &amp; Impact
                    </h4>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#00007B]/80 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#0F9A73] shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies Used Tags */}
                {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                  <div className="pt-4 border-t border-[#00007B]/10 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-[#00007B]/60 mr-1">Stack:</span>
                    {exp.technologiesUsed.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#f8fafd] text-[#00007B] border border-[#00007B]/15 font-semibold"
                      >
                        <TechIcon name={tech} size={12} />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
