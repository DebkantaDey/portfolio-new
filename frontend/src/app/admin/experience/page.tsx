'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Search,
  Building,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Check,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon, TECH_LIBRARY } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Experience } from '../../../types';
import { formatDate } from '../../../lib/utils';
import { toast } from 'sonner';

// Helper to calculate human-readable tenure (e.g. "2 yrs 4 mos")
function formatDuration(startDateStr: string, endDateStr?: string | null, currentlyWorking?: boolean): string {
  try {
    const start = new Date(startDateStr);
    const end = currentlyWorking || !endDateStr ? new Date() : new Date(endDateStr);
    if (isNaN(start.getTime())) return '';
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months < 0) months = 0;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (remMonths > 0 || years === 0) parts.push(`${remMonths} mo${remMonths > 1 ? 's' : ''}`);
    return parts.join(' ');
  } catch {
    return '';
  }
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadExperiences = async () => {
    try {
      const data = await api.getExperiences();
      // Sort by displayOrder ascending or latest startDate
      setExperiences(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch {
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleOpenAdd = () => {
    setEditingExp({
      companyName: '',
      companyLogo: '',
      companyWebsite: '',
      jobTitle: '',
      employmentType: 'Full-time',
      location: 'Remote',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      currentlyWorking: true,
      description: '',
      responsibilitiesText: '',
      achievementsText: '',
      technologiesList: ['React', 'Next.js', 'TypeScript', 'Node.js'],
      displayOrder: experiences.length + 1,
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({
      ...exp,
      companyLogo: exp.companyLogo || '',
      companyWebsite: exp.companyWebsite || '',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      responsibilitiesText: (exp.responsibilities || []).join('\n'),
      achievementsText: (exp.achievements || []).join('\n'),
      technologiesList: exp.technologiesUsed || [],
    });
    setIsModalOpen(true);
  };

  const handleAddTechnology = (tech: string) => {
    if (!editingExp) return;
    const current = editingExp.technologiesList || [];
    if (!current.includes(tech)) {
      setEditingExp({
        ...editingExp,
        technologiesList: [...current, tech],
      });
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      technologiesList: (editingExp.technologiesList || []).filter((t: string) => t !== techToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp.companyName || !editingExp.jobTitle) {
      toast.error('Please enter company name and job title');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...editingExp,
        companyLogo: editingExp.companyLogo || null,
        companyWebsite: editingExp.companyWebsite || null,
        responsibilities: editingExp.responsibilitiesText
          ? editingExp.responsibilitiesText.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : [],
        achievements: editingExp.achievementsText
          ? editingExp.achievementsText.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : [],
        technologiesUsed: editingExp.technologiesList || [],
        endDate: editingExp.currentlyWorking ? null : editingExp.endDate || null,
      };

      if (editingExp.id) {
        await api.updateExperience(editingExp.id, payload);
        toast.success(`Role at '${editingExp.companyName}' updated`);
      } else {
        await api.createExperience(payload);
        toast.success(`Role at '${editingExp.companyName}' added`);
      }
      setIsModalOpen(false);
      loadExperiences();
    } catch (err: any) {
      toast.error(err.message || 'Error saving experience');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteExperience(deleteConfirmId);
      toast.success('Experience record deleted');
      setDeleteConfirmId(null);
      loadExperiences();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting experience');
    }
  };

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch =
      exp.companyName.toLowerCase().includes(search.toLowerCase()) ||
      exp.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      (exp.technologiesUsed &&
        exp.technologiesUsed.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    const matchesType =
      typeFilter === 'All'
        ? true
        : typeFilter === 'Current'
        ? exp.currentlyWorking
        : exp.employmentType === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPositions = experiences.length;
  const currentRole = experiences.find((e) => e.currentlyWorking);

  return (
    <div className="space-y-8">
      {/* Header & Metric Banner */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30 text-xs font-mono font-bold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career Trajectory Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#00007B] tracking-tight">
              Work Experience &amp; Positions
            </h1>
            <p className="text-xs sm:text-sm text-[#00007B]/70 max-w-2xl leading-relaxed">
              Curate roles, leadership responsibilities, measurable business impact, and production technologies used throughout your engineering career.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAdd}
              className="bg-[#0F9A73] hover:bg-[#12b88a] text-white shadow-md font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Add New Position</span>
            </Button>
          </div>
        </div>

        {/* Quick Career Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#00007B]/10">
          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Total Positions
            </div>
            <div className="text-xl font-extrabold text-[#00007B] mt-0.5">
              {totalPositions} Roles
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Active Status
            </div>
            <div className="text-sm font-bold text-[#0F9A73] mt-1 truncate flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F9A73] animate-pulse" />
              <span>{currentRole ? currentRole.companyName : 'Open for Roles'}</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Employment Types
            </div>
            <div className="text-sm font-bold text-[#00007B] mt-1">
              Full-time &amp; Advisory
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Sync Status
            </div>
            <div className="text-xs font-mono text-[#0F9A73] mt-1 font-bold">
              Live on Portfolio
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#00007B]/15 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#00007B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, companies, or stacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-xs placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Current', 'Full-time', 'Contract', 'Freelance'].map((cat) => (
            <button
              key={cat}
              onClick={() => setTypeFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                typeFilter === cat
                  ? 'bg-[#00007B] text-white font-bold shadow-sm'
                  : 'bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B]/70 hover:text-[#00007B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Timeline Cards */}
      <div className="space-y-5">
        {filteredExperiences.map((exp) => {
          const isExpanded = expandedCardId === exp.id;
          const durationStr = formatDuration(exp.startDate, exp.endDate, exp.currentlyWorking);

          return (
            <div
              key={exp.id}
              className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#0F9A73] hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Side: Logo & Main Job Info */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-2 shadow-inner shrink-0">
                    {exp.companyLogo ? (
                      <TechIcon name={exp.companyLogo} size={32} />
                    ) : (
                      <Building className="w-7 h-7 text-[#00007B]/40" />
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-extrabold text-[#00007B] tracking-tight">
                        {exp.jobTitle}
                      </h3>
                      {exp.currentlyWorking && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F9A73] animate-ping" />
                          <span>Current Role</span>
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#00007B] bg-[#00007B]/5 border border-[#00007B]/15">
                        {exp.employmentType}
                      </span>
                      {exp.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 font-semibold">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Company name & URL */}
                    <div className="flex items-center gap-2 text-sm font-bold text-[#00007B]">
                      {exp.companyWebsite ? (
                        <a
                          href={exp.companyWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[#0F9A73] transition-colors inline-flex items-center gap-1 hover:underline"
                        >
                          <span>{exp.companyName}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#0F9A73]" />
                        </a>
                      ) : (
                        <span>{exp.companyName}</span>
                      )}
                      <span className="text-[#00007B]/30">•</span>
                      <span className="text-xs font-mono text-[#00007B]/60 font-normal">
                        Order #{exp.displayOrder}
                      </span>
                    </div>

                    {/* Timeline & Location */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#00007B]/70 pt-0.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                        <span>
                          {formatDate(exp.startDate)} —{' '}
                          {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                        </span>
                        {durationStr && (
                          <span className="text-[#0F9A73] font-bold">({durationStr})</span>
                        )}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0F9A73]" />
                        <span>{exp.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(exp)}
                    className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit Position</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirmId(exp.id)}
                    className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Description Preview */}
              <div className="mt-4 pt-4 border-t border-[#00007B]/10">
                <p className="text-xs sm:text-sm text-[#00007B]/80 leading-relaxed max-w-4xl">
                  {exp.description}
                </p>
              </div>

              {/* Collapsible Details: Responsibilities & Achievements */}
              {(exp.responsibilities?.length > 0 || exp.achievements?.length > 0) && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setExpandedCardId(isExpanded ? null : exp.id)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#0F9A73] hover:underline"
                  >
                    <span>
                      {isExpanded ? 'Hide Detailed Milestones' : 'View Key Responsibilities & Achievements'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 animate-in fade-in duration-200">
                      {/* Responsibilities list */}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <div>
                          <div className="text-xs font-mono font-bold text-[#00007B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9A73]" />
                            <span>Core Engineering Responsibilities</span>
                          </div>
                          <ul className="space-y-1.5">
                            {exp.responsibilities.map((r, i) => (
                              <li
                                key={i}
                                className="text-xs text-[#00007B]/80 flex items-start gap-2 leading-relaxed"
                              >
                                <span className="text-[#0F9A73] font-bold">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Achievements list */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div>
                          <div className="text-xs font-mono font-bold text-[#00007B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>Measurable Business Milestones</span>
                          </div>
                          <ul className="space-y-1.5">
                            {exp.achievements.map((a, i) => (
                              <li
                                key={i}
                                className="text-xs text-[#00007B]/80 flex items-start gap-2 leading-relaxed"
                              >
                                <span className="text-amber-500 font-bold">★</span>
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Technologies Badges */}
              {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#00007B]/10 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-[#00007B]/50 mr-1">Stack:</span>
                  {exp.technologiesUsed.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B] font-semibold"
                    >
                      <TechIcon name={t} size={12} />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredExperiences.length === 0 && !loading && (
          <div className="bg-white border border-[#00007B]/15 rounded-3xl p-12 text-center space-y-3">
            <Building className="w-10 h-10 text-[#00007B]/30 mx-auto" />
            <div className="text-base font-bold text-[#00007B]">No experience records found</div>
            <p className="text-xs text-[#00007B]/60 max-w-sm mx-auto">
              No positions matched your query. Click &quot;Add New Position&quot; to begin detailing your work timeline.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Experience Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp?.id ? 'Edit Professional Position' : 'Add Professional Experience'}
        maxWidth="4xl"
      >
        {editingExp && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 1: Company & Job Title */}
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-[#00007B] uppercase tracking-wider pb-1 border-b border-[#00007B]/10">
                1. Role &amp; Organization Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                    Job Title / Designatory Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.jobTitle || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, jobTitle: e.target.value })}
                    placeholder="e.g. Staff Full-Stack Engineer, Systems Architect"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.companyName || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditingExp({
                        ...editingExp,
                        companyName: name,
                        // If logo not set, optionally auto-detect tech brand
                        companyLogo: editingExp.companyLogo || name.toLowerCase().replace(/[^a-z0-9]/g, ''),
                      });
                    }}
                    placeholder="e.g. Vercel, Stripe, Google, Datadog"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={editingExp.employmentType || 'Full-time'}
                    onChange={(e) => setEditingExp({ ...editingExp, employmentType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                    Location &amp; Work Model
                  </label>
                  <input
                    type="text"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA (Remote)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                    Company Website URL
                  </label>
                  <input
                    type="url"
                    value={editingExp.companyWebsite || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, companyWebsite: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Company Logo or Tech Brand */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Company Logo or Tech Brand Icon"
                value={editingExp.companyLogo || ''}
                onChange={(logoVal) => setEditingExp({ ...editingExp, companyLogo: logoVal })}
                helperText="Select a tech tool logo badge, upload company logo PNG/SVG, or paste a link"
                mode="all"
              />
            </div>

            {/* Section 3: Timeline & Tenancy */}
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-[#00007B] uppercase tracking-wider pb-1 border-b border-[#00007B]/10">
                2. Timeline &amp; Tenancy
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingExp.startDate || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-medium text-[#00007B]">
                      End Date
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#0F9A73]">
                      <input
                        type="checkbox"
                        checked={editingExp.currentlyWorking || false}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            currentlyWorking: e.target.checked,
                            endDate: e.target.checked ? '' : editingExp.endDate,
                          })
                        }
                        className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                      />
                      <span>Currently working here</span>
                    </label>
                  </div>

                  <input
                    type="date"
                    disabled={editingExp.currentlyWorking}
                    value={editingExp.endDate || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Narrative, Responsibilities, Achievements */}
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-[#00007B] uppercase tracking-wider pb-1 border-b border-[#00007B]/10">
                3. Role Overview, Responsibilities &amp; Achievements
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  High-Level Role Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  placeholder="Summarize your ownership, team scope, and primary domain responsibilities..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                    Key Responsibilities (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editingExp.responsibilitiesText || ''}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, responsibilitiesText: e.target.value })
                    }
                    placeholder="Architected fault-tolerant microservices&#10;Lead sprint planning and system RFCs&#10;Mentored 6 engineers across frontend and backend"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                    Measurable Achievements &amp; Metrics (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editingExp.achievementsText || ''}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, achievementsText: e.target.value })
                    }
                    placeholder="Reduced p99 database query latency by 45%&#10;Saved $120k/yr in AWS infrastructure spend&#10;Scaled system to support 2M daily active users"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Technologies Used with Interactive Selector */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B]">
                    Technologies &amp; Frameworks Leveraged *
                  </label>
                  <p className="text-[11px] text-[#00007B]/60">
                    Click any tech badge below to associate it with this position.
                  </p>
                </div>
              </div>

              {/* Selected Tech Badges */}
              <div className="flex flex-wrap gap-2 min-h-9 p-2.5 bg-white border border-[#00007B]/15 rounded-xl">
                {(editingExp.technologiesList || []).map((t: string) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-[#0F9A73]/15 text-[#00007B] border border-[#0F9A73]/30 font-bold"
                  >
                    <TechIcon name={t} size={14} />
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(t)}
                      className="ml-1 text-rose-500 hover:text-rose-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(editingExp.technologiesList || []).length === 0 && (
                  <span className="text-xs text-[#00007B]/40 italic">
                    No tools added yet. Click from the quick tools below.
                  </span>
                )}
              </div>

              {/* Quick Add Tech Badges */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {TECH_LIBRARY.map((item) => {
                  const isAdded = (editingExp.technologiesList || []).includes(item.name);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddTechnology(item.name)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono transition-all ${
                        isAdded
                          ? 'bg-[#0F9A73] text-white font-bold opacity-60'
                          : 'bg-white border border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]'
                      }`}
                    >
                      <TechIcon name={item.id} size={13} />
                      <span>{item.name}</span>
                      {isAdded ? <Check className="w-3 h-3 ml-0.5" /> : <Plus className="w-3 h-3 ml-0.5 text-[#0F9A73]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Order & Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Display Order Sequence
                </label>
                <input
                  type="number"
                  value={editingExp.displayOrder || 1}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      displayOrder: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#00007B]">
                  <input
                    type="checkbox"
                    checked={editingExp.isFeatured ?? true}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                  />
                  <span>Feature on Homepage Timeline</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#00007B]/10 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="shadow-md">
                Save Position Record
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Position Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs text-[#00007B]">
              Are you sure you want to permanently delete this experience entry? This cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
