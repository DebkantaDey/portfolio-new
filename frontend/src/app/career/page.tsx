'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Briefcase,
  MapPin,
  Sparkles,
  Building2,
  CheckCircle2,
  Download,
  Mail,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { CareerOpportunity } from '../../types';

export default function CareerPage() {
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareerOpportunities().then((res) => {
      setOpportunities(res);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0F9A73] hover:underline font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Recruiter Overview Hero */}
        <div className="space-y-4">
          <Badge variant="cyan">Recruiter &amp; Company Hub</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight">
            Career Opportunities &amp; Candidate Fit
          </h1>
          <p className="text-[#00007B]/80 text-base sm:text-lg leading-relaxed max-w-3xl font-normal">
            I am currently open to exciting opportunities in software engineering, distributed systems architecture, Next.js / full-stack engineering, and international remote roles.
          </p>
        </div>

        {/* Candidate Profile Summary Box */}
        <div className="bg-[#f8fafd] border border-[#00007B]/15 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#00007B] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0F9A73]" />
            Recruiter Quick Reference Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-white p-5 rounded-2xl border border-[#00007B]/15 space-y-1.5 shadow-xs">
              <span className="text-xs uppercase font-mono text-[#00007B]/60 font-semibold">Target Roles</span>
              <p className="text-sm font-bold text-[#00007B]">
                Staff / Senior Full-Stack Engineer, Software Architect, Lead Backend Engineer
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#00007B]/15 space-y-1.5 shadow-xs">
              <span className="text-xs uppercase font-mono text-[#00007B]/60 font-semibold">Work Preferences</span>
              <p className="text-sm font-bold text-[#00007B]">
                100% Worldwide Remote or Hybrid (SF / NYC)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#00007B]/15 space-y-1.5 shadow-xs">
              <span className="text-xs uppercase font-mono text-[#00007B]/60 font-semibold">Core Technologies</span>
              <p className="text-sm font-bold text-[#0F9A73] font-mono">
                Next.js, TypeScript, Node.js, PostgreSQL, Docker, AWS, Redis
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link href="/resume">
              <Button variant="primary" size="md" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
                <Download className="w-4 h-4 mr-2" />
                <span>Download Updated Resume</span>
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="md" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
                <Mail className="w-4 h-4 mr-2 text-[#0F9A73]" />
                <span>Direct Contact for Hiring Managers</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Career Opportunities Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#00007B] flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#0F9A73]" />
            Curated Open Opportunities
          </h2>
          <p className="text-sm text-[#00007B]/70">
            Below are target roles matching my technical profile. Clicking &ldquo;Apply Now&rdquo; takes you directly to the official company job portal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white border border-[#00007B]/15 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-xl transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#00007B]">{opp.jobTitle}</h3>
                      <p className="text-xs font-semibold text-[#0F9A73] mt-1 flex items-center gap-1.5">
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
                      {opp.requiredSkills.map((skill) => (
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
                    href={opp.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full block"
                  >
                    <Button variant="primary" size="sm" className="w-full justify-center bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-sm">
                      <span>Apply Now</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
