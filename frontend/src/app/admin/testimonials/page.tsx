'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  AlertTriangle,
  Quote,
  Sparkles,
  Search,
  User,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Testimonial } from '../../../types';
import { toast } from 'sonner';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadTestimonials = async () => {
    try {
      const data = await api.getTestimonials();
      setTestimonials(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingTest({
      name: '',
      designation: 'VP of Engineering',
      company: 'Datadog / Tech Corp',
      testimonial: '',
      profileImage: '',
      rating: 5,
      featured: true,
      displayOrder: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tst: Testimonial) => {
    setEditingTest({
      ...tst,
      profileImage: tst.profileImage || '',
      rating: tst.rating || 5,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest.name || !editingTest.testimonial) {
      toast.error('Please enter name and testimonial text');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...editingTest,
        profileImage: editingTest.profileImage || null,
        rating: Number(editingTest.rating) || 5,
      };

      if (editingTest.id) {
        await api.updateTestimonial(editingTest.id, payload);
        toast.success(`Recommendation from '${editingTest.name}' updated`);
      } else {
        await api.createTestimonial(payload);
        toast.success(`Recommendation added`);
      }
      setIsModalOpen(false);
      loadTestimonials();
    } catch (err: any) {
      toast.error(err.message || 'Error saving testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteTestimonial(deleteConfirmId);
      toast.success('Testimonial removed');
      setDeleteConfirmId(null);
      loadTestimonials();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting testimonial');
    }
  };

  const filtered = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.company.toLowerCase().includes(search.toLowerCase()) ||
      t.designation.toLowerCase().includes(search.toLowerCase()) ||
      t.testimonial.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Metrics Banner */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30 text-xs font-mono font-bold">
              <Quote className="w-3.5 h-3.5" />
              <span>Social Proof &amp; Endorsements</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#00007B] tracking-tight">
              Testimonials &amp; Peer Reviews
            </h1>
            <p className="text-xs sm:text-sm text-[#00007B]/70 max-w-2xl leading-relaxed">
              Curate executive recommendations, peer engineering testimonials, and client endorsements demonstrating leadership and execution quality.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="bg-[#0F9A73] hover:bg-[#12b88a] text-white shadow-md font-bold self-start lg:self-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Testimonial</span>
          </Button>
        </div>

        {/* Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#00007B]/10">
          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Total Endorsements
            </div>
            <div className="text-xl font-extrabold text-[#00007B] mt-0.5">
              {testimonials.length} Reviews
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Average Rating
            </div>
            <div className="text-sm font-bold text-[#0F9A73] mt-1 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>5.0 / 5.0 Rating</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Featured Flag
            </div>
            <div className="text-sm font-bold text-[#00007B] mt-1">
              {testimonials.filter((t) => t.featured).length} on Homepage
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Endorser Scope
            </div>
            <div className="text-xs font-mono text-[#0F9A73] mt-1 font-bold">
              Engineering Leadership
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
            placeholder="Search recommender, company, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-xs placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
          />
        </div>
        <div className="text-xs font-mono text-[#00007B]/60">
          Showing {filtered.length} of {testimonials.length} endorsements
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#0F9A73] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Rating Stars & Featured Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {t.featured && (
                  <Badge variant="emerald" size="sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Quote text */}
              <div className="relative mb-5">
                <Quote className="w-8 h-8 text-[#00007B]/10 absolute -top-3 -left-2 -z-0" />
                <p className="relative z-10 text-xs sm:text-sm text-[#00007B]/80 italic leading-relaxed line-clamp-5">
                  &ldquo;{t.testimonial}&rdquo;
                </p>
              </div>

              {/* Recommender Info & Avatar */}
              <div className="pt-4 border-t border-[#00007B]/10 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#f8fafd] border border-[#00007B]/15 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                  {t.profileImage ? (
                    <img src={t.profileImage} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-[#00007B]/40" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-[#00007B] truncate">{t.name}</div>
                  <div className="text-[11px] font-mono text-[#0F9A73] font-semibold truncate">
                    {t.designation} • {t.company}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex items-center justify-between mt-5">
              <span className="text-[11px] font-mono text-[#00007B]/50">Order #{t.displayOrder}</span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(t)}
                  className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirmId(t.id)}
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
            No testimonials found matching &quot;{search}&quot;.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTest?.id ? 'Edit Peer Recommendation' : 'Add Testimonial Endorsement'}
        maxWidth="3xl"
      >
        {editingTest && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Recommender Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingTest.name || ''}
                  onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Designatory Title / Role *
                </label>
                <input
                  type="text"
                  required
                  value={editingTest.designation || ''}
                  onChange={(e) => setEditingTest({ ...editingTest, designation: e.target.value })}
                  placeholder="e.g. VP of Engineering, Principal Architect"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={editingTest.company || ''}
                  onChange={(e) => setEditingTest({ ...editingTest, company: e.target.value })}
                  placeholder="e.g. Datadog, Stripe, Netflix"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Star Rating (1 - 5 Stars)
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditingTest({ ...editingTest, rating: star })}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (editingTest.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-[#00007B] ml-2 font-bold">
                    {editingTest.rating || 5} Stars
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Avatar Upload */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Recommender Headshot or Avatar Photo"
                value={editingTest.profileImage || ''}
                onChange={(imgVal) => setEditingTest({ ...editingTest, profileImage: imgVal })}
                helperText="Upload their LinkedIn avatar or headshot photo (JPG, PNG, WebP)"
                mode="image"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Endorsement Narrative / Testimonial Quote *
              </label>
              <textarea
                required
                rows={4}
                value={editingTest.testimonial || ''}
                onChange={(e) => setEditingTest({ ...editingTest, testimonial: e.target.value })}
                placeholder="Alex was instrumental in our core infrastructure modernization..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingTest.displayOrder || 1}
                  onChange={(e) =>
                    setEditingTest({
                      ...editingTest,
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
                    checked={editingTest.featured ?? true}
                    onChange={(e) => setEditingTest({ ...editingTest, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                  />
                  <span>Feature on Testimonials Carousel</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="shadow-md">
                Save Endorsement
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
              Are you sure you want to remove this recommendation?
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
