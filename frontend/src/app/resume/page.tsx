'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, CheckCircle2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { Profile, Experience, Education, Skill } from '../../types';
import { formatDate } from '../../lib/utils';
import { useSettings } from '@/context/SettingsContext';

export default function ResumePage() {
  const { getSetting } = useSettings();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    Promise.allSettled([
      api.getProfile(),
      api.getExperiences(),
      api.getEducations(),
      api.getSkills(),
    ]).then(([p, exp, edu, sk]) => {
      if (p.status === 'fulfilled') setProfile(p.value);
      if (exp.status === 'fulfilled') setExperiences(exp.value);
      if (edu.status === 'fulfilled') setEducations(edu.value);
      if (sk.status === 'fulfilled') setSkills(sk.value);
    });
  }, []);

  const downloadUrl = profile?.resumeUrl || '/uploads/Alex_Morgan_Resume.pdf';

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0F9A73] hover:underline font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <a href={downloadUrl} download="Alex_Morgan_Resume.pdf">
            <Button variant="primary" size="sm" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
              <Download className="w-4 h-4 mr-2" />
              <span>Download PDF</span>
            </Button>
          </a>
        </div>

        {/* Paper Document Representation */}
        <div className="bg-[#f8fafd] border-2 border-[#00007B]/15 rounded-3xl p-8 sm:p-12 shadow-xl space-y-10">
          {/* Header */}
          <div className="border-b border-[#00007B]/10 pb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-[#00007B]">
                  {getSetting('brandName') || profile?.fullName || 'Alex Morgan'}
                </h1>
                <p className="text-base font-bold text-[#0F9A73] font-mono mt-1">
                  {getSetting('brandRole') || profile?.professionalTitle || 'Senior Full-Stack Engineer & Cloud Architect'}
                </p>
              </div>

              <div className="text-xs font-mono text-[#00007B]/70 space-y-1 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <span>{getSetting('location') || profile?.location || 'San Francisco, CA (Remote)'}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <a href={`mailto:${getSetting('contactEmail') || profile?.email || 'alex@alexmorgan.dev'}`} className="hover:underline font-bold text-[#00007B]">
                    {getSetting('contactEmail') || profile?.email || 'alex@alexmorgan.dev'}
                  </a>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <span>{getSetting('contactPhone') || profile?.phone || '+1 (415) 890-4211'}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#00007B]/80 leading-relaxed pt-2 font-normal">
              {profile?.longBio || profile?.shortBio}
            </p>
          </div>

          {/* Core Technical Skills */}
          <div className="space-y-4">
            <h2 className="text-sm uppercase font-mono font-bold tracking-widest text-[#0F9A73]">
              Technical Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-white text-[#00007B] border border-[#00007B]/15 shadow-xs"
                >
                  <span className="font-bold">{s.name}</span> <span className="text-[#00007B]/60">({s.category})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-6">
            <h2 className="text-sm uppercase font-mono font-bold tracking-widest text-[#0F9A73]">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-2 bg-white p-5 rounded-2xl border border-[#00007B]/10 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h3 className="text-base font-bold text-[#00007B]">
                      {exp.jobTitle} — <span className="text-[#00007B]/70 font-semibold">{exp.companyName}</span>
                    </h3>
                    <span className="text-xs font-mono text-[#0F9A73] font-bold">
                      {formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-xs text-[#00007B]/80 leading-relaxed font-normal">{exp.description}</p>
                  {exp.responsibilities && (
                    <ul className="space-y-1 pt-1">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="text-xs text-[#00007B]/85 flex items-start gap-2">
                          <span className="text-[#0F9A73] font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4 pt-4 border-t border-[#00007B]/10">
            <h2 className="text-sm uppercase font-mono font-bold tracking-widest text-[#0F9A73]">
              Education
            </h2>
            {educations.map((edu) => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-[#00007B]/10">
                <div>
                  <h3 className="text-sm font-bold text-[#00007B]">
                    {edu.degree} in {edu.fieldOfStudy}
                  </h3>
                  <p className="text-xs text-[#00007B]/70">{edu.institution}, {edu.location}</p>
                </div>
                <span className="text-xs font-mono text-[#0F9A73] font-bold">
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
