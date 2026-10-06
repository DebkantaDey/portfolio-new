'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle2,
  Code2,
  Cpu,
  Check,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon, TECH_LIBRARY } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Service } from '../../../types';
import { slugify } from '../../../lib/utils';
import { toast } from 'sonner';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSrv, setEditingSrv] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingSrv({
      title: '',
      slug: '',
      icon: 'react',
      shortDescription: '',
      fullDescription: '',
      featuresText: 'High-availability architecture\nDeterministic performance & SEO\nAutomated CI/CD integration',
      technologiesList: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      displayOrder: services.length + 1,
      featured: true,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingSrv({
      ...srv,
      icon: srv.icon || 'react',
      featuresText: (srv.features || []).join('\n'),
      technologiesList: srv.technologies || [],
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!editingSrv) return;
    const updates: any = { title: newTitle };
    if (!editingSrv.id) {
      updates.slug = slugify(newTitle);
    }
    setEditingSrv({ ...editingSrv, ...updates });
  };

  const handleAddTechnology = (tech: string) => {
    if (!editingSrv) return;
    const current = editingSrv.technologiesList || [];
    if (!current.includes(tech)) {
      setEditingSrv({
        ...editingSrv,
        technologiesList: [...current, tech],
      });
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    if (!editingSrv) return;
    setEditingSrv({
      ...editingSrv,
      technologiesList: (editingSrv.technologiesList || []).filter((t: string) => t !== techToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSrv.title || !editingSrv.slug) {
      toast.error('Please enter title and slug');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...editingSrv,
        features: editingSrv.featuresText
          ? editingSrv.featuresText.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : [],
        technologies: editingSrv.technologiesList || [],
      };

      if (editingSrv.id) {
        await api.updateService(editingSrv.id, payload);
        toast.success(`Service '${editingSrv.title}' updated`);
      } else {
        await api.createService(payload);
        toast.success(`Service '${editingSrv.title}' created`);
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err: any) {
      toast.error(err.message || 'Error saving service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteService(deleteConfirmId);
      toast.success('Service deleted');
      setDeleteConfirmId(null);
      loadServices();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting service');
    }
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      (s.technologies && s.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="space-y-8">
      {/* Header & Metrics Banner */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30 text-xs font-mono font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Engineering Offerings</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#00007B] tracking-tight">
              Services &amp; Technical Capabilities
            </h1>
            <p className="text-xs sm:text-sm text-[#00007B]/70 max-w-2xl leading-relaxed">
              Define specialized consulting engagements, architecture audits, full-stack systems engineering, and cloud deployment contracts.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="bg-[#0F9A73] hover:bg-[#12b88a] text-white shadow-md font-bold self-start lg:self-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Service</span>
          </Button>
        </div>

        {/* Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#00007B]/10">
          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Total Services
            </div>
            <div className="text-xl font-extrabold text-[#00007B] mt-0.5">
              {services.length} Offerings
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Active Engagements
            </div>
            <div className="text-sm font-bold text-[#0F9A73] mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F9A73] animate-pulse" />
              <span>{services.filter((s) => s.isActive).length} Available</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Featured Flag
            </div>
            <div className="text-sm font-bold text-[#00007B] mt-1">
              {services.filter((s) => s.featured).length} on Homepage
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Delivery Model
            </div>
            <div className="text-xs font-mono text-[#0F9A73] mt-1 font-bold">
              Retainer &amp; Sprint
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
            placeholder="Search services or technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-xs placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
          />
        </div>
        <div className="text-xs font-mono text-[#00007B]/60">
          Showing {filtered.length} of {services.length} services
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#0F9A73] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-2 shrink-0 shadow-inner">
                    <TechIcon name={srv.icon || 'react'} size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#00007B] tracking-tight">{srv.title}</h3>
                    <span className="text-xs font-mono text-[#0F9A73] font-bold">/services/{srv.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {srv.featured && (
                    <Badge variant="emerald" size="sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {srv.isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#00007B]/40 border border-[#00007B]/15">
                      Paused
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#00007B]/80 leading-relaxed mb-4">
                {srv.shortDescription}
              </p>

              {/* Key Features / Scope */}
              {srv.features && srv.features.length > 0 && (
                <div className="space-y-1.5 mb-4 p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
                  <div className="text-[11px] font-mono uppercase font-bold text-[#00007B]/70 mb-1">
                    Deliverables &amp; Methodology
                  </div>
                  {srv.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#00007B]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9A73] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {srv.features.length > 3 && (
                    <div className="text-[11px] font-mono text-[#0F9A73] font-bold pt-1">
                      +{srv.features.length - 3} additional deliverables
                    </div>
                  )}
                </div>
              )}

              {/* Tech Badges */}
              {srv.technologies && srv.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {srv.technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B] font-semibold"
                    >
                      <TechIcon name={t} size={12} />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex items-center justify-between mt-5">
              <Link
                href={`/services/${srv.slug}`}
                target="_blank"
                className="text-xs font-mono font-bold text-[#0F9A73] hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(srv)}
                  className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirmId(srv.id)}
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
            No services found matching &quot;{search}&quot;.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSrv?.id ? 'Edit Engineering Service' : 'Add New Service Offering'}
        maxWidth="3xl"
      >
        {editingSrv && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingSrv.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Distributed Cloud Architecture"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  URL Slug (/services/slug) *
                </label>
                <input
                  type="text"
                  required
                  value={editingSrv.slug || ''}
                  onChange={(e) => setEditingSrv({ ...editingSrv, slug: slugify(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm font-mono focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            {/* Service Icon with Tool Selector */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Primary Service Badge / Tech Tool Icon"
                value={editingSrv.icon || ''}
                onChange={(iconVal) => setEditingSrv({ ...editingSrv, icon: iconVal })}
                helperText="Pick a core tech badge (React, Docker, AWS, PostgreSQL) or upload an icon"
                mode="all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Short Description (Cards Preview) *
              </label>
              <textarea
                required
                rows={2}
                value={editingSrv.shortDescription || ''}
                onChange={(e) => setEditingSrv({ ...editingSrv, shortDescription: e.target.value })}
                placeholder="High-impact 1-2 sentence overview of what clients or companies achieve..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Full Description (Detailed Scope) *
              </label>
              <textarea
                required
                rows={4}
                value={editingSrv.fullDescription || ''}
                onChange={(e) => setEditingSrv({ ...editingSrv, fullDescription: e.target.value })}
                placeholder="Detailed breakdown of engagement timeline, deliverables, architecture review, and guarantees..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Key Deliverables &amp; Features (one per line)
              </label>
              <textarea
                rows={3}
                value={editingSrv.featuresText || ''}
                onChange={(e) => setEditingSrv({ ...editingSrv, featuresText: e.target.value })}
                placeholder="Deterministic performance audits&#10;Zero-downtime database migration strategy&#10;Infrastructure as code with Terraform"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            {/* Interactive Technologies Picker */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-[#00007B]">
                  Associated Technologies &amp; Tooling *
                </label>
                <span className="text-[11px] font-mono text-[#00007B]/60">
                  Click a tech tool to toggle
                </span>
              </div>

              {/* Selected Badges */}
              <div className="flex flex-wrap gap-2 min-h-9 p-2.5 bg-white border border-[#00007B]/15 rounded-xl">
                {(editingSrv.technologiesList || []).map((t: string) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-[#0F9A73]/15 text-[#00007B] border border-[#0F9A73]/30 font-bold"
                  >
                    <TechIcon name={t} size={13} />
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
              </div>

              {/* Quick Add Grid */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {TECH_LIBRARY.map((item) => {
                  const isAdded = (editingSrv.technologiesList || []).includes(item.name);
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingSrv.displayOrder || 1}
                  onChange={(e) =>
                    setEditingSrv({ ...editingSrv, displayOrder: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#00007B]">
                  <input
                    type="checkbox"
                    checked={editingSrv.featured ?? true}
                    onChange={(e) => setEditingSrv({ ...editingSrv, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                  />
                  <span>Featured on Home</span>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#00007B]">
                  <input
                    type="checkbox"
                    checked={editingSrv.isActive ?? true}
                    onChange={(e) => setEditingSrv({ ...editingSrv, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                  />
                  <span>Active &amp; Taking Clients</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="shadow-md">
                Save Service
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
              Are you sure you want to delete this service offering?
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
