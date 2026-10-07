'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Github, Linkedin, Twitter, Mail, ArrowUpRight, ShieldCheck, Clock, BookOpen } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { getSetting } = useSettings();
  const [time, setTime] = useState<string>('');

  const brandName = getSetting('brandName', 'Alex Morgan');
  const footerBio = getSetting(
    'footerBio',
    'Staff Full-Stack Software Engineer & Cloud Systems Architect. Crafting deterministic, fault-tolerant web applications and high-throughput microservices.'
  );
  const footerStatusText = getSetting('footerStatusText', 'All services online');
  const footerCopyright = getSetting(
    'footerCopyright',
    `© ${new Date().getFullYear()} ${brandName}. Built with Next.js, Node.js & PostgreSQL.`
  );
  const primaryColor = getSetting('primaryColor', '#00007B');
  const accentColor = getSetting('accentColor', '#0F9A73');
  const contactEmail = getSetting('contactEmail', 'alex@alexmorgan.dev');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/Los_Angeles',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#f8fafd] border-t border-[#00007B]/10 text-[#00007B]/80 pt-16 pb-12 font-sans">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#00007B]/10">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#00007B] border border-[#0F9A73]/50 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-all">
                <Terminal className="w-4 h-4 text-[#0F9A73]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#00007B]">{brandName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#00007B]/80 max-w-sm">
              {footerBio}
            </p>

            {/* System Status & Local Time */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#0F9A73] animate-pulse" />
                <span>{footerStatusText}</span>
              </div>
              {time && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#00007B]/10 text-[#00007B] shadow-sm">
                  <Clock className="w-3 h-3 text-[#0F9A73]" />
                  <span>{time} PST (SF)</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com/alexmorgan"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-[#00007B]/15 flex items-center justify-center text-[#00007B] hover:text-[#0F9A73] hover:border-[#0F9A73] transition-colors shadow-sm"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/alexmorgan-dev"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-[#00007B]/15 flex items-center justify-center text-[#00007B] hover:text-[#0F9A73] hover:border-[#0F9A73] transition-colors shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/alexmorgandev"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-[#00007B]/15 flex items-center justify-center text-[#00007B] hover:text-[#0F9A73] hover:border-[#0F9A73] transition-colors shadow-sm"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="w-8 h-8 rounded-lg bg-white border border-[#00007B]/15 flex items-center justify-center text-[#00007B] hover:text-[#0F9A73] hover:border-[#0F9A73] transition-colors shadow-sm"
                aria-label="Email Me"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-[#00007B] mb-4">Sitemap</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#0F9A73] transition-colors">Overview</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0F9A73] transition-colors">About &amp; Bio</Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-[#0F9A73] transition-colors">Skills &amp; Stack</Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-[#0F9A73] transition-colors">Career Timeline</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#0F9A73] transition-colors">Case Studies</Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-[#0F9A73] transition-colors">Resume / CV</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Professional Services */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-[#00007B] mb-4">Practice Areas</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-[#0F9A73] transition-colors">Next.js &amp; React 19</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#0F9A73] transition-colors">Distributed Backend &amp; Go</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#0F9A73] transition-colors">Cloud &amp; Kubernetes</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#0F9A73] transition-colors">Database Engineering</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Engineering & Endpoints */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-[#00007B] mb-4">Developers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="http://localhost:5000/api-docs" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-[#0F9A73] transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <span>OpenAPI Swagger</span>
                  <ArrowUpRight className="w-3 h-3 text-[#00007B]/40" />
                </a>
              </li>
              <li>
                <span className="block text-xs text-[#00007B]/60 font-mono">Palette:</span>
                <span className="text-[#0F9A73] text-xs font-mono font-semibold">{primaryColor} • {accentColor}</span>
              </li>
              <li>
                <span className="block text-xs text-[#00007B]/60 font-mono">Version:</span>
                <span className="text-[#00007B] text-xs font-mono font-semibold">v2.4.0 (git: 9f8a32d)</span>
              </li>
              <li className="pt-2">
                <Link href="/admin/login" className="inline-flex items-center gap-1 text-xs text-[#00007B] hover:text-[#0F9A73] transition-colors font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <span>Admin CMS Access</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#00007B]/60 gap-4">
          <p>{footerCopyright}</p>
          <p className="flex items-center gap-1 font-mono">
            Designed for high performance &amp; 100% Lighthouse score.
          </p>
        </div>
      </div>
    </footer>
  );
};
