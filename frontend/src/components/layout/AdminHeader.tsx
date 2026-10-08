'use client';

import React from 'react';
import { Menu, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { authStorage } from '../../lib/auth';
import { ThemeToggle } from '../ui/ThemeToggle';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = authStorage.getUser();

  const handleLogout = () => {
    authStorage.clear();
    router.push('/admin/login');
  };

  const pageTitle =
    pathname === '/admin'
      ? 'Dashboard Overview'
      : pathname
          .replace('/admin/', '')
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

  return (
    <header className="h-16 bg-white dark:bg-[#0e1424] border-b border-[#00007B]/10 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-[#f8fafd] dark:bg-[#131c31] border border-[#00007B]/15 dark:border-white/15 text-[#00007B] dark:text-slate-200 hover:text-[#0F9A73]"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#00007B] dark:text-white tracking-tight">{pageTitle}</h1>
          <p className="text-[11px] text-[#00007B]/60 dark:text-slate-400 hidden sm:block">Manage your portfolio content in real time</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#00007B] dark:text-slate-200 hover:text-[#0F9A73] border border-[#00007B]/15 dark:border-white/15 bg-[#f8fafd] dark:bg-[#131c31] px-3 py-1.5 rounded-lg transition-colors font-semibold"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#0F9A73]" />
          <span>Live Site</span>
        </a>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#00007B]/10 dark:border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] font-bold text-xs flex items-center justify-center">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-[#00007B] dark:text-white leading-none">{user?.name || 'Administrator'}</span>
            <span className="text-[10px] text-[#0F9A73] font-mono flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3 h-3 inline" />
              ADMIN
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-[#00007B]/60 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
