import React from 'react';
import Link from 'next/link';
import { GraduationCap, Calendar, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Education } from '../../types';
import { formatDate } from '../../lib/utils';

interface EducationSectionProps {
  educations: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ educations }) => {
  return (
    <section className="py-20 bg-[#f8fafd] border-t border-[#00007B]/10">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs uppercase font-mono tracking-widest text-[#0F9A73] font-bold">Academic Foundation</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight mt-1">
              Education &amp; Honors
            </h2>
          </div>
          <Link href="/education">
            <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
              <span>View Academic Details</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#0F9A73]" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="bg-white border border-[#00007B]/15 p-6 sm:p-8 rounded-2xl hover:border-[#0F9A73] hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F9A73]/10 border border-[#0F9A73]/20 flex items-center justify-center text-[#0F9A73] shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#00007B]">{edu.degree}</h3>
                  <p className="text-sm font-bold text-[#0F9A73]">{edu.fieldOfStudy}</p>
                  <p className="text-xs text-[#00007B]/70 mt-0.5">{edu.institution}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#00007B]/70 mb-4 pb-4 border-b border-[#00007B]/10">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F9A73]" />
                  {edu.location}
                </span>
                {edu.grade && <span className="text-[#0F9A73] font-bold">GPA: {edu.grade}</span>}
              </div>

              {edu.description && (
                <p className="text-xs text-[#00007B]/80 leading-relaxed mb-4">{edu.description}</p>
              )}

              {edu.achievements && edu.achievements.length > 0 && (
                <ul className="space-y-1.5">
                  {edu.achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#00007B]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9A73] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
