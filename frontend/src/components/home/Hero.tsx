'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Download, 
  Sparkles, 
  Terminal, 
  Code2, 
  Database, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  GitBranch, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Profile } from '../../types';
import { InteractiveTerminal } from '../common/InteractiveTerminal';
import { useSettings } from '@/context/SettingsContext';

interface HeroProps {
  profile?: Profile | null;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const { getSetting } = useSettings();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const fullName = getSetting('heroHeadline') || profile?.fullName || 'Debkanta Dey';
  const title = getSetting('heroTitle') || profile?.professionalTitle || 'Senior Full-Stack Engineer & Cloud Architect';
  const bio =
    getSetting('heroBio') ||
    profile?.shortBio ||
    'Architecting resilient distributed backends, high-performance Next.js web applications, and fault-tolerant cloud systems that scale to millions of requests.';
  const availability = getSetting('availabilityStatus') || profile?.availabilityStatus || 'Available for Senior/Staff roles & Advisory';
  const email = getSetting('contactEmail') || profile?.email || 'debkanta@debkanta.dev';
  const location = getSetting('location') || profile?.location || 'San Francisco, CA (Remote)';
  const tagline = getSetting('heroTagline', 'main branch • 8+ years shipping code');
  const ctaPrimary = getSetting('heroCtaPrimary', 'Explore Case Studies');
  const ctaSecondary = getSetting('heroCtaSecondary', 'Download CV');
  const ctaContact = getSetting('heroCtaContact', 'Contact');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-white bg-grid">
      {/* Subtle radial ambient spotlight in #0F9A73 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#0F9A73]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Left Column: Editorial & Engineer Intro */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Live Availability & Location Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F9A73] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F9A73]" />
                </span>
                <span>{availability}</span>
              </div> */}

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B] text-xs font-mono">
                <MapPin className="w-3 h-3 text-[#0F9A73]" />
                <span>{location}</span>
              </div>
            </div>

            {/* Headline with Deep Royal Navy #00007B */}
            <div className="space-y-3">
              {/* <div className="flex items-center gap-2 text-xs font-mono text-[#0F9A73] uppercase tracking-widest font-bold">
                <GitBranch className="w-3.5 h-3.5" />
                <span>{tagline}</span>
              </div> */}
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#00007B] tracking-tight leading-[1.1]">
                {fullName}
              </h1>

              <h2 className="text-xl sm:text-2xl font-bold text-[#00007B]/90">
                {title.split('&').map((part, idx) => (
                  <span key={idx}>
                    {idx > 0 && <span className="text-[#0F9A73] font-normal"> &amp; </span>}
                    {part.trim()}
                  </span>
                ))}
              </h2>
            </div>

            {/* Senior Narrative Bio */}
            <p className="text-[#00007B]/80 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              {bio}
            </p>

            {/* Quick Email Interaction Chip */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 max-w-md shadow-sm">
              <Mail className="w-4 h-4 text-[#0F9A73] ml-2 shrink-0" />
              <span className="text-xs font-mono text-[#00007B] font-medium truncate flex-1">{email}</span>
              <button
                onClick={handleCopyEmail}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-lg transition-all bg-white hover:bg-[#00007B]/5 text-[#00007B] border border-[#00007B]/15 shadow-sm font-semibold"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span className="text-[#0F9A73] font-bold">Copied</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/projects">
                <Button variant="primary" size="lg" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
                  <span>{ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/resume">
                <Button variant="outline" size="lg" className="border-[#00007B]/20 text-[#00007B] hover:bg-[#f8fafd] hover:border-[#00007B]">
                  <Download className="w-4 h-4 mr-2 text-[#0F9A73]" />
                  <span>{ctaSecondary}</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="bg-[#00007B] text-white border-transparent hover:bg-[#000099]">
                  <span>{ctaContact}</span>
                </Button>
              </Link>
            </div>

            {/* Engineering Metrics Pills */}
            <div className="pt-4 border-t border-[#00007B]/10 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-2xl font-bold font-mono text-[#00007B] tracking-tight">8+</span>
                <span className="text-xs text-[#00007B]/70 font-medium">Years in Prod</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-mono text-[#0F9A73] tracking-tight">40+</span>
                <span className="text-xs text-[#00007B]/70 font-medium">Apps Delivered</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-mono text-[#0F9A73] tracking-tight">99.9%</span>
                <span className="text-xs text-[#00007B]/70 font-medium">Uptime Track</span>
              </div>
            </div>
          </div>

          {/* Right Column: Handcrafted Interactive Developer Console */}
          <div className="lg:col-span-6 w-full">
            <InteractiveTerminal />
          </div>

        </div>
      </div>
    </section>
  );
};
