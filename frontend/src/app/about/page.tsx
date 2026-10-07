'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle2, ShieldCheck, Cpu, Code2, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { Profile } from '../../types';
import { useSettings } from '@/context/SettingsContext';

export default function AboutPage() {
  const { getSetting } = useSettings();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(console.error);
  }, []);

  const fullName = getSetting('brandName') || profile?.fullName || 'Debkanta Dey';
  const title = getSetting('brandRole') || profile?.professionalTitle || 'Senior Full-Stack Engineer & Cloud Architect';
  const longBio =
    profile?.longBio ||
    getSetting('heroBio') ||
    'With over 8 years of full-stack engineering expertise, I specialize in crafting robust, scalable digital platforms using Next.js, TypeScript, Node.js, and PostgreSQL. I have architected systems processing millions of daily transactions, led multi-disciplinary agile teams, and built intuitive user interfaces with clean architecture and meticulous attention to UX.';
  const email = getSetting('contactEmail') || profile?.email || 'alex@alexmorgan.dev';
  const phone = getSetting('contactPhone') || profile?.phone || '+1 (415) 890-4211';
  const location = getSetting('location') || profile?.location || 'San Francisco, CA';

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0F9A73] hover:underline font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8 space-y-4">
            <Badge variant="cyan">Professional Journey</Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight">
              About {fullName}
            </h1>
            <p className="text-xl font-bold text-[#0F9A73] font-mono">{title}</p>
            <p className="text-[#00007B]/80 text-base sm:text-lg leading-relaxed pt-2 font-normal">
              {longBio}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/resume">
                <Button variant="primary" size="md" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Curriculum Vitae</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="md" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
                  <span>Get In Touch</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-64 aspect-square rounded-3xl overflow-hidden border-2 border-[#00007B]/20 shadow-xl">
              <img
                src={profile?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Technical Philosophy & Values */}
        <div className="space-y-6 pt-12 border-t border-[#00007B]/10">
          <h2 className="text-2xl font-bold text-[#00007B]">How I Build &amp; Lead</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8fafd] border border-[#00007B]/15 p-6 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0F9A73]/15 border border-[#0F9A73]/30 flex items-center justify-center text-[#0F9A73] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#00007B] mb-2">Systems Architecture</h3>
              <p className="text-xs text-[#00007B]/75 leading-relaxed">
                Prioritizing reliability, predictable failure modes, idempotent APIs, and clear bounded contexts over fragile complexity.
              </p>
            </div>

            <div className="bg-[#f8fafd] border border-[#00007B]/15 p-6 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0F9A73]/15 border border-[#0F9A73]/30 flex items-center justify-center text-[#0F9A73] mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#00007B] mb-2">Code Quality &amp; Type Safety</h3>
              <p className="text-xs text-[#00007B]/75 leading-relaxed">
                Treating TypeScript and automated testing suites as non-negotiable tools to catch regressions before they reach production.
              </p>
            </div>

            <div className="bg-[#f8fafd] border border-[#00007B]/15 p-6 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#00007B]/10 border border-[#00007B]/20 flex items-center justify-center text-[#00007B] mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#00007B] mb-2">Developer Ergonomics</h3>
              <p className="text-xs text-[#00007B]/75 leading-relaxed">
                Fostering an engineering culture of empathetic code reviews, mentorship, and clear documentation that accelerates entire teams.
              </p>
            </div>
          </div>
        </div>

        {/* Location & Contact Summary */}
        <div className="bg-[#f8fafd] border border-[#00007B]/15 p-8 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-[#00007B]">Current Focus &amp; Availability</h3>
          <p className="text-sm text-[#00007B]/80 leading-relaxed">
            Currently based in {location}, open to worldwide remote staff/senior software engineering roles, high-impact consulting engagements, and technical advisory.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#00007B]">
            <span>Direct Email: <span className="text-[#0F9A73] font-bold">{email}</span></span>
            <span>•</span>
            <span>Phone: <span className="text-[#0F9A73] font-bold">{phone}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
