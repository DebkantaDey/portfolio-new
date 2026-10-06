'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, GraduationCap, Calendar, MapPin, CheckCircle2, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { Education } from '../../types';
import { formatDate } from '../../lib/utils';

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);

  useEffect(() => {
    api.getEducations().then(setEducations).catch(console.error);
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
          <Badge variant="cyan">Academic Background</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight mt-2">
            Education &amp; Degrees
          </h1>
          <p className="text-[#00007B]/70 text-sm sm:text-base mt-2 max-w-2xl font-normal">
            Computer science degree, coursework in distributed systems, compilers, algorithms, and academic honors.
          </p>
        </div>

        <div className="space-y-6">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="bg-white border border-[#00007B]/15 p-8 rounded-3xl hover:border-[#0F9A73] hover:shadow-xl transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F9A73]/10 border border-[#0F9A73]/20 flex items-center justify-center text-[#0F9A73] shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#00007B]">{edu.degree}</h2>
                    <p className="text-base font-bold text-[#0F9A73]">{edu.fieldOfStudy}</p>
                    <p className="text-xs text-[#00007B]/70 mt-0.5">{edu.institution}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#00007B]/70">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f8fafd] border border-[#00007B]/10">
                    <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f8fafd] border border-[#00007B]/10">
                    <MapPin className="w-3.5 h-3.5 text-[#0F9A73]" />
                    {edu.location}
                  </span>
                  {edu.grade && <span className="text-[#0F9A73] font-bold">GPA: {edu.grade}</span>}
                </div>
              </div>

              {edu.description && (
                <p className="text-sm text-[#00007B]/80 leading-relaxed mb-6 font-normal">{edu.description}</p>
              )}

              {edu.achievements && edu.achievements.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-[#00007B]/10">
                  <h3 className="text-xs uppercase font-mono font-bold text-[#00007B]/70 tracking-wider">
                    Academic Honors &amp; Activities
                  </h3>
                  <ul className="space-y-2">
                    {edu.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#00007B]/80 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#0F9A73] shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {edu.website && (
                <div className="pt-4 mt-6 border-t border-[#00007B]/10">
                  <a
                    href={edu.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9A73] hover:text-[#00007B] transition-colors"
                  >
                    <span>Institution Website</span>
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
