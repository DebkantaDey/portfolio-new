'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Download, Terminal, Sparkles, Search, Command } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../lib/utils';
import { useSettings } from '@/context/SettingsContext';

const navLinks = [
  { href: '/', label: 'Overview' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const { getSetting } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const brandName = getSetting('brandName', 'Debkanta Dey');
  const brandRole = getSetting('brandRole', 'Senior Full-Stack Architect');
  const availability = getSetting('availabilityStatus', 'Available for hire');

  // Do not render public navbar inside /admin
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      })
    );
  };

  if (isAdmin) return null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#00007B]/10 shadow-sm py-3'
          : 'bg-white/80 backdrop-blur-sm py-4 border-b border-[#00007B]/5'
      )}
    >
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#00007B] border border-[#0F9A73]/50 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-all">
              <Terminal className="w-5 h-5 text-[#0F9A73]" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#00007B] flex items-center gap-1.5">
                {brandName}
                <span className="w-2 h-2 rounded-full bg-[#0F9A73] inline-block animate-pulse" title={availability} />
              </span>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#0F9A73] font-bold">{brandRole}</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f0f4fc] dark:bg-[#131c31] border border-[#00007B]/10 dark:border-white/10 px-3 py-1.5 rounded-full shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-[#00007B] text-white shadow-sm'
                      : 'text-[#00007B]/80 hover:text-[#00007B] hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Command Palette Trigger & CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Command Palette Search Button */}
            <button
              onClick={triggerCommandPalette}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f4fc] dark:bg-[#131c31] hover:bg-white dark:hover:bg-[#1e293b] border border-[#00007B]/15 dark:border-white/15 text-xs text-[#00007B] dark:text-slate-200 transition-all font-mono shadow-sm"
              title="Search commands (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#0F9A73]" />
              <span className="hidden md:inline text-[11px] text-[#00007B]/70 dark:text-slate-400">Search</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded bg-white dark:bg-[#1e293b] text-[#00007B] dark:text-slate-200 border border-[#00007B]/15 dark:border-white/15">
                <Command className="w-3 h-3" />K
              </kbd>
            </button>

            <ThemeToggle />

            <Link href="/resume">
              <Button variant="outline" size="sm" className="hidden md:inline-flex border-[#00007B]/20 dark:border-white/20 text-[#00007B] dark:text-slate-100 hover:bg-[#f0f4fc] dark:hover:bg-[#1e293b] hover:border-[#00007B]">
                <Download className="w-3.5 h-3.5 mr-1 text-[#0F9A73]" />
                Resume
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="primary" size="sm" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-sm">
                Initiate Contact
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={triggerCommandPalette}
              className="p-2 rounded-lg bg-[#f0f4fc] dark:bg-[#131c31] border border-[#00007B]/15 dark:border-white/15 text-[#0F9A73]"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#f0f4fc] dark:bg-[#131c31] border border-[#00007B]/15 dark:border-white/15 text-[#00007B] dark:text-slate-200 hover:text-[#0F9A73] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#00007B] dark:text-slate-200" /> : <Menu className="w-5 h-5 text-[#00007B] dark:text-slate-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[65px] bg-white dark:bg-[#0b0f19] border-b border-[#00007B]/15 dark:border-white/15 p-6 shadow-2xl transition-all">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between',
                    isActive
                      ? 'bg-[#00007B] text-white'
                      : 'text-[#00007B] dark:text-slate-200 hover:bg-[#f0f4fc] dark:hover:bg-[#162036]'
                  )}
                >
                  {link.label}
                  {isActive && <Sparkles className="w-4 h-4 text-[#0F9A73]" />}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-[#00007B]/10 dark:border-white/10 flex flex-col gap-2.5">
              <Link href="/resume" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full justify-center border-[#00007B]/20 dark:border-white/20 text-[#00007B] dark:text-slate-200">
                  <Download className="w-4 h-4 mr-2 text-[#0F9A73]" />
                  View &amp; Download Resume
                </Button>
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full justify-center bg-[#0F9A73] text-white font-bold">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
