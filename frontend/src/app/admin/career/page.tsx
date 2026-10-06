'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Briefcase,
  Building2,
  AlertTriangle,
  Search,
  Sparkles,
  MapPin,
  DollarSign,
  Globe,
  Check,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon, TECH_LIBRARY } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { CareerOpportunity } from '../../../types';
import { toast } from 'sonner';

export default function AdminCareerPage() {
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadOpportunities = async () => {
    try {
      const data = await api.getCareerOpportunities();
      setOpportunities(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch {
      toast.error('Failed to load career opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleOpenAdd = () => {
    setEditingOpp({
      companyName: '',
      companyLogo: '',
      companyWebsite: '',
      jobTitle: '',
      location: 'San Francisco, CA / Remote',
      country: 'United States',
      remoteType: 'Remote',
      employmentType: 'Full-time',
      jobDescription: 'Architecting high-throughput distributed services, leading API design, and scaling cloud infrastructure.',
      skillsList: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
      salaryRange: '$180,000 - $240,000 USD + Equity',
      applicationUrl: 'https://',
      status: 'Open',
      featured: true,
      displayOrder: opportunities.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (opp: CareerOpportunity) => {
    setEditingOpp({
      ...opp,
      companyLogo: opp.companyLogo || '',
      companyWebsite: opp.companyWebsite || '',
      skillsList: opp.requiredSkills || [],
    });
    setIsModalOpen(true);
  };

  const handleAddSkill = (skill: string) => {
    if (!editingOpp) return;
    const current = editingOpp.skillsList || [];
    if (!current.includes(skill)) {
      setEditingOpp({
        ...editingOpp,
        skillsList: [...current, skill],
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!editingOpp) return;
    setEditingOpp({
      ...editingOpp,
      skillsList: (editingOpp.skillsList || []).filter((s: string) => s !== skillToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp.companyName || !editingOpp.jobTitle || !editingOpp.applicationUrl) {
      toast.error('Please enter company, title, and valid application URL');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...editingOpp,
        companyLogo: editingOpp.companyLogo || null,
        companyWebsite: editingOpp.companyWebsite || null,
        requiredSkills: editingOpp.skillsList || [],
      };

      if (editingOpp.id) {
        await api.updateCareerOpportunity(editingOpp.id, payload);
        toast.success(`Role '${editingOpp.jobTitle}' at '${editingOpp.companyName}' updated`);
      } else {
        await api.createCareerOpportunity(payload);
        toast.success(`Role created`);
      }
      setIsModalOpen(false);
      loadOpportunities();
    } catch (err: any) {
      toast.error(err.message || 'Error saving opportunity');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteCareerOpportunity(deleteConfirmId);
      toast.success('Opportunity deleted');
      setDeleteConfirmId(null);
      loadOpportunities();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting opportunity');
    }
  };

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.companyName.toLowerCase().includes(search.toLowerCase()) ||
      opp.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      (opp.requiredSkills &&
        opp.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase())));
    const matchesRemote =
      remoteFilter === 'All' ? true : opp.remoteType === remoteFilter;
    return matchesSearch && matchesRemote;
  });

  return (
    <div className="space-y-8">
      {/* Header & Metrics Banner */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30 text-xs font-mono font-bold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter &amp; Hiring Gateway</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#00007B] tracking-tight">
              Career &amp; Engineering Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-[#00007B]/70 max-w-2xl leading-relaxed">
              Curate target engineering roles, salary ranges, remote preferences, and direct application links for talent partners and recruiters.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="bg-[#0F9A73] hover:bg-[#12b88a] text-white shadow-md font-bold self-start lg:self-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Opportunity</span>
          </Button>
        </div>

        {/* Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#00007B]/10">
          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Open Positions
            </div>
            <div className="text-xl font-extrabold text-[#00007B] mt-0.5">
              {opportunities.filter((o) => o.status === 'Open').length} Open
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Remote Preference
            </div>
            <div className="text-sm font-bold text-[#0F9A73] mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F9A73] animate-pulse" />
              <span>{opportunities.filter((o) => o.remoteType === 'Remote').length} Remote First</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Compensation
            </div>
            <div className="text-sm font-bold text-[#00007B] mt-1">
              Competitive Market
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Direct Apply
            </div>
            <div className="text-xs font-mono text-[#0F9A73] mt-1 font-bold">
              Active Portals
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
            placeholder="Search roles, companies, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-xs placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Remote', 'Hybrid', 'On-site'].map((type) => (
            <button
              key={type}
              onClick={() => setRemoteFilter(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                remoteFilter === type
                  ? 'bg-[#00007B] text-white font-bold shadow-sm'
                  : 'bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B]/70 hover:text-[#00007B]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-white border border-[#00007B]/15 p-6 rounded-3xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-md transition-all shadow-sm group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-2 shrink-0 shadow-inner">
                    {opp.companyLogo ? (
                      <TechIcon name={opp.companyLogo} size={28} />
                    ) : (
                      <Building2 className="w-6 h-6 text-[#00007B]/40" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#00007B] tracking-tight leading-snug">
                      {opp.jobTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F9A73] mt-0.5">
                      <span>{opp.companyName}</span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant={opp.remoteType === 'Remote' ? 'emerald' : 'cyan'}
                  size="sm"
                >
                  {opp.remoteType}
                </Badge>
              </div>

              {/* Compensation & Location */}
              <div className="space-y-1.5 mb-4 text-xs font-mono text-[#00007B]/70">
                {opp.salaryRange && (
                  <div className="flex items-center gap-1.5 text-[#00007B] font-bold">
                    <DollarSign className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span>{opp.salaryRange}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <span>{opp.location}</span>
                </div>
              </div>

              <p className="text-xs text-[#00007B]/80 line-clamp-3 leading-relaxed mb-4">
                {opp.jobDescription}
              </p>

              {/* Required Skills Badges */}
              {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.requiredSkills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B] font-semibold"
                    >
                      <TechIcon name={skill} size={11} />
                      <span>{skill}</span>
                    </span>
                  ))}
                  {opp.requiredSkills.length > 4 && (
                    <span className="text-[10px] font-mono text-[#00007B]/50 self-center">
                      +{opp.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex items-center justify-between mt-5">
              <a
                href={opp.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-bold text-[#0F9A73] hover:underline inline-flex items-center gap-1"
              >
                <span>Apply Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(opp)}
                  className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirmId(opp.id)}
                  className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-sm font-mono text-[#00007B]/60 bg-white border border-[#00007B]/15 rounded-3xl">
            No career opportunities found matching &quot;{search}&quot;.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOpp?.id ? 'Edit Opportunity' : 'Add Career Opportunity'}
        maxWidth="3xl"
      >
        {editingOpp && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingOpp.jobTitle || ''}
                  onChange={(e) => setEditingOpp({ ...editingOpp, jobTitle: e.target.value })}
                  placeholder="e.g. Staff Full-Stack Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingOpp.companyName || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditingOpp({
                      ...editingOpp,
                      companyName: name,
                      companyLogo: editingOpp.companyLogo || name.toLowerCase().replace(/[^a-z0-9]/g, ''),
                    });
                  }}
                  placeholder="e.g. OpenAI, Stripe, Figma"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            {/* Company Logo / Tool Badge */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Company Brand Logo or Tech Badge"
                value={editingOpp.companyLogo || ''}
                onChange={(logoVal) => setEditingOpp({ ...editingOpp, companyLogo: logoVal })}
                helperText="Select a tech icon or upload custom company logo image"
                mode="all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Remote Policy
                </label>
                <select
                  value={editingOpp.remoteType || 'Remote'}
                  onChange={(e) => setEditingOpp({ ...editingOpp, remoteType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Employment Type
                </label>
                <select
                  value={editingOpp.employmentType || 'Full-time'}
                  onChange={(e) => setEditingOpp({ ...editingOpp, employmentType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Compensation / Salary Range
                </label>
                <input
                  type="text"
                  value={editingOpp.salaryRange || ''}
                  onChange={(e) => setEditingOpp({ ...editingOpp, salaryRange: e.target.value })}
                  placeholder="$190k - $250k USD"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Location (City &amp; Country)
                </label>
                <input
                  type="text"
                  value={editingOpp.location || ''}
                  onChange={(e) => setEditingOpp({ ...editingOpp, location: e.target.value })}
                  placeholder="San Francisco, CA or Remote (US/Global)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Application Link / ATS URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingOpp.applicationUrl || ''}
                  onChange={(e) => setEditingOpp({ ...editingOpp, applicationUrl: e.target.value })}
                  placeholder="https://jobs.lever.co/... or greenhouse.io"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Role Description &amp; Scope
              </label>
              <textarea
                rows={3}
                value={editingOpp.jobDescription || ''}
                onChange={(e) => setEditingOpp({ ...editingOpp, jobDescription: e.target.value })}
                placeholder="High-level engineering problem space, team mission, and expectations..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            {/* Interactive Required Skills Picker */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-[#00007B]">
                  Required Core Technical Skills *
                </label>
                <span className="text-[11px] font-mono text-[#00007B]/60">
                  Click a tech tool to toggle
                </span>
              </div>

              {/* Selected Badges */}
              <div className="flex flex-wrap gap-2 min-h-9 p-2.5 bg-white border border-[#00007B]/15 rounded-xl">
                {(editingOpp.skillsList || []).map((s: string) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-[#0F9A73]/15 text-[#00007B] border border-[#0F9A73]/30 font-bold"
                  >
                    <TechIcon name={s} size={13} />
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="ml-1 text-rose-500 hover:text-rose-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Quick Add Grid */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {TECH_LIBRARY.map((item) => {
                  const isAdded = (editingOpp.skillsList || []).includes(item.name);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddSkill(item.name)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingOpp.displayOrder || 1}
                  onChange={(e) =>
                    setEditingOpp({ ...editingOpp, displayOrder: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#00007B]">
                  <input
                    type="checkbox"
                    checked={editingOpp.featured ?? true}
                    onChange={(e) => setEditingOpp({ ...editingOpp, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                  />
                  <span>Feature on Career Page</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="shadow-md">
                Save Opportunity
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs text-[#00007B]">
              Are you sure you want to delete this career opportunity?
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
