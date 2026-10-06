'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, CheckCircle2, Award, Briefcase, Building } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { TechIcon } from '../../components/common/TechIcon';
import { api } from '../../lib/api';
import { Experience } from '../../types';
import { formatDate } from '../../lib/utils';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    api.getExperiences().then(setExperiences).catch(console.error);
  }, []);

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
          <Badge variant="cyan">Career History</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight mt-2">
            Work Experience
          </h1>
          <p className="text-[#00007B]/70 text-sm sm:text-base mt-2 max-w-2xl font-normal">
            Detailed breakdown of full-stack engineering roles, team leadership, architectural achievements, and technology stacks.
          </p>
        </div>

        {/* Full Timeline */}
        <div className="relative pl-6 md:pl-10 border-l-2 border-[#00007B]/15 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#0F9A73] flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#0F9A73]" />
              </div>

              <div className="bg-white border border-[#00007B]/15 p-6 sm:p-8 rounded-2xl hover:border-[#0F9A73] hover:shadow-xl transition-all shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-1.5 shadow-inner shrink-0 mt-1">
                      {exp.companyLogo ? (
                        <TechIcon name={exp.companyLogo} size={28} />
                      ) : (
                        <Building className="w-6 h-6 text-[#00007B]/40" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-[#00007B]">{exp.jobTitle}</h2>
                        {exp.currentlyWorking && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30">
                            Active Leadership
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[#00007B] mt-1">
                        {exp.companyName}
                        <span className="mx-2 text-[#00007B]/40">•</span>
                        <span className="text-xs font-mono text-[#0F9A73] font-semibold">{exp.employmentType}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#00007B]/70">
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

                <p className="text-sm text-[#00007B]/80 leading-relaxed mb-6 font-normal">
                  {exp.description}
                </p>

                {/* Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xs uppercase font-mono font-bold text-[#00007B]/70 tracking-wider">
                      Responsibilities &amp; Architecture
                    </h3>
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

                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xs uppercase font-mono font-bold text-[#0F9A73] tracking-wider">
                      Key Milestones
                    </h3>
                    <ul className="space-y-2">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#00007B]/80 leading-relaxed">
                          <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                  <div className="pt-4 border-t border-[#00007B]/10 flex flex-wrap gap-2">
                    {exp.technologiesUsed.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-[#f8fafd] text-[#00007B] border border-[#00007B]/15 font-semibold"
                      >
                        <TechIcon name={tech} size={13} />
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
    </div>
  );
}
