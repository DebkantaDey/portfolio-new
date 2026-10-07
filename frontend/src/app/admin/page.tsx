'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Wrench,
  Briefcase,
  Award,
  Inbox,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { DashboardOverview } from '../../types';
import { formatDate } from '../../lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboardOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#0F9A73] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#00007B]/70 font-mono mt-3">Synthesizing admin telemetry...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Production Projects',
      total: data?.totalProjects || 0,
      sub: `${data?.publishedProjects || 0} live • ${data?.featuredProjects || 0} featured`,
      icon: FolderGit2,
      href: '/admin/projects',
      color: 'text-[#0F9A73]',
      trend: '+100% indexed',
    },
    {
      label: 'Technical Skills',
      total: data?.totalSkills || 0,
      sub: 'Categorized proficiencies',
      icon: Wrench,
      href: '/admin/skills',
      color: 'text-[#0F9A73]',
      trend: 'Active',
    },
    {
      label: 'Work Experience',
      total: data?.totalExperiences || 0,
      sub: 'Career timeline positions',
      icon: Briefcase,
      href: '/admin/experience',
      color: 'text-amber-500',
      trend: 'Verified',
    },
    {
      label: 'Certifications',
      total: data?.totalCertifications || 0,
      sub: `${data?.totalCertifications || 0} active credentials`,
      icon: Award,
      href: '/admin/certifications',
      color: 'text-indigo-600',
      trend: 'Credentials',
    },
    {
      label: 'Inbound Inquiries',
      total: data?.totalMessages || 0,
      sub: `${data?.unreadMessages || 0} unread messages`,
      icon: Inbox,
      href: '/admin/messages',
      color: 'text-rose-600',
      badge: data?.unreadMessages ? `${data.unreadMessages} New` : undefined,
    },
    {
      label: 'Career Portals',
      total: data?.totalCareerOpportunities || 0,
      sub: 'Company career links & roles',
      icon: Sparkles,
      href: '/admin/career',
      color: 'text-[#0F9A73]',
      trend: 'Private',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white border-2 border-[#00007B]/15 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F9A73] animate-pulse" />
            <span className="text-[11px] font-mono text-[#0F9A73] uppercase tracking-wider font-bold">
              Live Production Console
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00007B] tracking-tight">
            Portfolio CMS Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[#00007B]/80 max-w-xl leading-relaxed">
            Manage projects, skills, career opportunities, and direct recruiter messages with instant reflection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/projects">
            <Button variant="primary" size="sm" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Create Project</span>
            </Button>
          </Link>
          <Link href="/admin/profile">
            <Button variant="secondary" size="sm" className="bg-[#00007B] hover:bg-[#000052] text-white font-bold">
              <User className="w-4 h-4 mr-1.5" />
              <span>Edit Profile</span>
            </Button>
          </Link>
          <a href="/" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
              <ExternalLink className="w-4 h-4 mr-1.5 text-[#0F9A73]" />
              <span>Open Live Site</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-[#00007B]/15 p-6 rounded-2xl hover:border-[#0F9A73] hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-[#00007B]/60 font-semibold">{card.label}</span>
                  <div className="text-3xl font-extrabold text-[#00007B] font-mono mt-1">
                    {card.total}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/10 group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#00007B]/10 flex items-center justify-between text-xs text-[#00007B]/70">
                <span className="truncate">{card.sub}</span>
                {card.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    {card.badge}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#0F9A73] font-bold">{card.trend}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Messages Feed */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#00007B]/10">
          <div className="flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-[#0F9A73]" />
            <h3 className="text-lg font-bold text-[#00007B]">Recent Inbound Transmissions</h3>
          </div>
          <Link href="/admin/messages" className="text-xs font-mono text-[#0F9A73] hover:underline flex items-center gap-1 font-bold">
            <span>Open Inbox ({data?.totalMessages || 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentMessages && data.recentMessages.length > 0 ? (
          <div className="space-y-3">
            {data.recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-[#f8fafd] p-4 rounded-xl border border-[#00007B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#0F9A73]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#00007B]">{msg.name}</span>
                    <span className="text-xs text-[#00007B]/60 font-mono">({msg.email})</span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#00007B] font-semibold mt-1">{msg.subject}</p>
                  <p className="text-xs text-[#00007B]/70 line-clamp-1 mt-0.5">{msg.message}</p>
                </div>

                <div className="text-xs font-mono text-[#00007B]/60 shrink-0 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0F9A73]" />
                  {formatDate(msg.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-[#00007B]/60 text-xs font-mono">
            No contact messages received yet.
          </div>
        )}
      </div>
    </div>
  );
}
