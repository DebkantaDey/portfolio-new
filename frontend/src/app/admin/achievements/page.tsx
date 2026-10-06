'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Trophy,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Calendar,
  Search,
  Award,
  Medal,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Achievement } from '../../../types';
import { formatDate } from '../../../lib/utils';
import { toast } from 'sonner';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadAchievements = async () => {
    try {
      const data = await api.getAchievements();
      setAchievements(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch {
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleOpenAdd = () => {
    setEditingAch({
      title: '',
      organization: 'TechCrunch Disrupt / Global Hackathon',
      description: '',
      icon: 'award',
      image: '',
      date: new Date().toISOString().split('T')[0],
      url: 'https://',
      displayOrder: achievements.length + 1,
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingAch({
      ...ach,
      icon: ach.icon || 'award',
      image: ach.image || '',
      date: ach.date ? new Date(ach.date).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch.title || !editingAch.description) {
      toast.error('Please enter title and description');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...editingAch,
        icon: editingAch.icon || null,
        image: editingAch.image || null,
        url: editingAch.url || null,
        date: editingAch.date || null,
      };

      if (editingAch.id) {
        await api.updateAchievement(editingAch.id, payload);
        toast.success(`Achievement updated`);
      } else {
        await api.createAchievement(payload);
        toast.success(`Achievement added`);
      }
      setIsModalOpen(false);
      loadAchievements();
    } catch (err: any) {
      toast.error(err.message || 'Error saving achievement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteAchievement(deleteConfirmId);
      toast.success('Achievement deleted');
      setDeleteConfirmId(null);
      loadAchievements();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting achievement');
    }
  };

  const filtered = achievements.filter(
    (ach) =>
      ach.title.toLowerCase().includes(search.toLowerCase()) ||
      (ach.organization && ach.organization.toLowerCase().includes(search.toLowerCase())) ||
      ach.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Metrics Banner */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30 text-xs font-mono font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Honors &amp; Recognition</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#00007B] tracking-tight">
              Achievements &amp; Milestones
            </h1>
            <p className="text-xs sm:text-sm text-[#00007B]/70 max-w-2xl leading-relaxed">
              Showcase global hackathon victories, patent filings, keynote presentations, open-source milestones, and engineering awards.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="bg-[#0F9A73] hover:bg-[#12b88a] text-white shadow-md font-bold self-start lg:self-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Achievement</span>
          </Button>
        </div>

        {/* Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#00007B]/10">
          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Total Accolades
            </div>
            <div className="text-xl font-extrabold text-[#00007B] mt-0.5">
              {achievements.length} Honors
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Hackathons &amp; Awards
            </div>
            <div className="text-sm font-bold text-[#0F9A73] mt-1 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>1st Place Victories</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Featured Flag
            </div>
            <div className="text-sm font-bold text-[#00007B] mt-1">
              {achievements.filter((a) => a.featured).length} on Homepage
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Impact Scope
            </div>
            <div className="text-xs font-mono text-[#0F9A73] mt-1 font-bold">
              Global &amp; Industry
            </div>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-[#00007B]/15 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#00007B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search achievements or organizers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-xs placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
          />
        </div>
        <div className="text-xs font-mono text-[#00007B]/60">
          Showing {filtered.length} of {achievements.length} records
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ach) => (
          <div
            key={ach.id}
            className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#0F9A73] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-2 shrink-0 shadow-inner">
                    {ach.image ? (
                      <TechIcon name={ach.image} size={28} />
                    ) : (
                      <TechIcon name={ach.icon || 'award'} size={28} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#00007B] tracking-tight leading-tight">
                      {ach.title}
                    </h3>
                    <div className="text-xs font-mono font-bold text-[#0F9A73] mt-0.5">
                      {ach.organization || 'Industry Honor'}
                    </div>
                  </div>
                </div>

                {ach.featured && (
                  <Badge variant="emerald" size="sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Event Image if uploaded */}
              {ach.image && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-[#00007B]/15 aspect-video bg-[#f8fafd]">
                  <img src={ach.image} alt={ach.title} className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-xs sm:text-sm text-[#00007B]/80 leading-relaxed mb-4">
                {ach.description}
              </p>

              {ach.date && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#00007B]/60 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <span>Honored: {formatDate(ach.date)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex items-center justify-between mt-4">
              {ach.url ? (
                <a
                  href={ach.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono font-bold text-[#0F9A73] hover:underline inline-flex items-center gap-1"
                >
                  <span>Verification Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[11px] font-mono text-[#00007B]/40">No external link</span>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(ach)}
                  className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirmId(ach.id)}
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
            No achievements found matching &quot;{search}&quot;.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAch?.id ? 'Edit Achievement' : 'Add Achievement / Honor'}
        maxWidth="3xl"
      >
        {editingAch && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Achievement / Award Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingAch.title || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                  placeholder="e.g. 1st Place - Global AI Hackathon"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Awarding Organization / Host *
                </label>
                <input
                  type="text"
                  required
                  value={editingAch.organization || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, organization: e.target.value })}
                  placeholder="e.g. Google Cloud, TechCrunch, MIT"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            {/* Icon or Photo Upload */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Achievement Badge Icon or Event Photo"
                value={editingAch.image || editingAch.icon || ''}
                onChange={(val) => setEditingAch({ ...editingAch, image: val, icon: val })}
                helperText="Upload an award photograph or select an official trophy/tech badge"
                mode="all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Date of Honor
                </label>
                <input
                  type="date"
                  value={editingAch.date || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Verification URL / Press Article
                </label>
                <input
                  type="url"
                  value={editingAch.url || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, url: e.target.value })}
                  placeholder="https://devpost.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Achievement Narrative &amp; Significance *
              </label>
              <textarea
                required
                rows={3}
                value={editingAch.description || ''}
                onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                placeholder="Describe the competitive scope, project breakthrough, or engineering merit..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingAch.displayOrder || 1}
                  onChange={(e) =>
                    setEditingAch({ ...editingAch, displayOrder: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#00007B]">
                  <input
                    type="checkbox"
                    checked={editingAch.featured ?? true}
                    onChange={(e) => setEditingAch({ ...editingAch, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                  />
                  <span>Feature on Achievements Section</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="shadow-md">
                Save Achievement
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
              Are you sure you want to delete this achievement record?
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
