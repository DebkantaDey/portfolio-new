'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Wrench,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Layers,
  Sparkles,
  Award,
  Trophy,
  MessageSquareQuote,
  Share2,
  Inbox,
  Settings,
  FileText,
  Upload,
  LogOut,
  ExternalLink,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { authStorage } from '../../lib/auth';
import { cn } from '../../lib/utils';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile & Bio', icon: User },
  { href: '/admin/resume', label: 'Resume Builder', icon: FileText },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/career', label: 'Career Opportunities', icon: Sparkles },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/social-links', label: 'Social Links', icon: Share2 },
  { href: '/admin/messages', label: 'Contact Messages', icon: Inbox },
  { href: '/admin/uploads', label: 'File & Resume', icon: Upload },
  { href: '/admin/settings', label: 'Settings & SEO', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authStorage.clear();
    router.push('/admin/login');
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-[#00007B]/10 flex items-center justify-between shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00007B] flex items-center justify-center text-white shadow-sm">
            <Terminal className="w-4 h-4 text-[#0F9A73]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#00007B] tracking-tight">Admin Console</span>
            <span className="block text-[10px] font-mono text-[#0F9A73] font-bold">Portfolio CMS</span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-2.5 px-2.5 space-y-0.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                'flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-all group',
                isActive
                  ? 'bg-[#0F9A73] text-white shadow-sm font-bold'
                  : 'text-[#00007B]/80 hover:text-[#00007B] hover:bg-[#f8fafd]'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-[#00007B]/60 group-hover:text-[#0F9A73]')} />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
            </Link>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-[#00007B]/10 space-y-1.5 shrink-0 bg-white">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-[#00007B]/80 hover:text-[#0F9A73] hover:bg-[#f8fafd] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#0F9A73]" />
            View Live Site
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
