'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Upload,
  X,
  Image as ImageIcon,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon, TECH_LIBRARY } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Project } from '../../../types';
import { slugify } from '../../../lib/utils';
import { toast } from 'sonner';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
      category: 'SaaS',
      projectType: 'Web Application',
      liveUrl: '',
      githubUrl: '',
      status: 'Completed',
      challenges: '',
      solutions: '',
      keyFeaturesText: 'Real-time WebSocket telemetry\nRole-based permissions\nHigh availability',
      responsibilities: 'Principal Architect & Lead Developer',
      displayOrder: projects.length + 1,
      featured: true,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject({
      ...proj,
      galleryImages: proj.galleryImages || [],
      technologies: proj.technologies || [],
      keyFeaturesText: (proj.keyFeatures || []).join('\n'),
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!editingProject) return;
    const updates: any = { title: newTitle };
    if (!editingProject.id) {
      updates.slug = slugify(newTitle);
    }
    setEditingProject({ ...editingProject, ...updates });
  };

  const handleAddTechnology = (tech: string) => {
    if (!editingProject) return;
    const current = editingProject.technologies || [];
    if (!current.includes(tech)) {
      setEditingProject({
        ...editingProject,
        technologies: [...current, tech],
      });
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: (editingProject.technologies || []).filter((t: string) => t !== techToRemove),
    });
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setIsUploadingGallery(true);
    try {
      const res = await api.uploadFile(file);
      setEditingProject({
        ...editingProject,
        galleryImages: [...(editingProject.galleryImages || []), res.url],
      });
      toast.success('Gallery image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Gallery upload failed');
    } finally {
      setIsUploadingGallery(false);
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      galleryImages: (editingProject.galleryImages || []).filter((_: any, i: number) => i !== indexToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject.title || !editingProject.slug) {
      toast.error('Please enter title and slug');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...editingProject,
        technologies: editingProject.technologies || [],
        galleryImages: editingProject.galleryImages || [],
        keyFeatures: editingProject.keyFeaturesText
          ? editingProject.keyFeaturesText.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : [],
        caseStudyUrl: `/projects/${editingProject.slug}`,
      };

      if (editingProject.id) {
        await api.updateProject(editingProject.id, payload);
        toast.success(`Project '${editingProject.title}' updated`);
      } else {
        await api.createProject(payload);
        toast.success(`Project '${editingProject.title}' created`);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || 'Error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteProject(deleteConfirmId);
      toast.success('Project deleted');
      setDeleteConfirmId(null);
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting project');
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#00007B] tracking-tight">Projects &amp; Case Studies</h2>
          <p className="text-xs text-[#00007B]/70 mt-1">
            Publish architectural case studies, manage tech stacks, images, and live demo links.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Project</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-[#00007B]/40 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter projects by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-xs focus:outline-none focus:border-[#0F9A73] shadow-sm"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white border border-[#00007B]/15 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-lg transition-all shadow-sm group"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-[#f8fafd] border-b border-[#00007B]/10">
                <img
                  src={proj.featuredImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <Badge variant="cyan" size="sm">
                    {proj.category}
                  </Badge>
                  {proj.featured && (
                    <Badge variant="emerald" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <h3 className="text-base font-bold text-[#00007B] leading-tight">{proj.title}</h3>
                <p className="text-xs text-[#00007B]/70 line-clamp-2 leading-relaxed">
                  {proj.shortDescription}
                </p>
                
                {/* Tech Badges with Icons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B] font-semibold"
                    >
                      <TechIcon name={t} size={12} />
                      <span>{t}</span>
                    </span>
                  ))}
                  {proj.technologies.length > 4 && (
                    <span className="text-[10px] font-mono text-[#00007B]/60 self-center">
                      +{proj.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-[#00007B]/10 flex items-center justify-between">
                <Link
                  href={`/projects/${proj.slug}`}
                  target="_blank"
                  className="text-xs font-mono text-[#0F9A73] hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <span>Preview Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(proj)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteConfirmId(proj.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-sm font-mono text-[#00007B]/60 bg-white border border-[#00007B]/15 rounded-2xl">
            No projects found matching &quot;{search}&quot;.
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject?.id ? 'Edit Project Case Study' : 'Create New Project'}
        maxWidth="4xl"
      >
        {editingProject && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Distributed Telemetry Platform"
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  URL Slug (/projects/slug) *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.slug || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: slugify(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm font-mono focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.category || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  placeholder="SaaS, FinTech, DevTools..."
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Project Type
                </label>
                <select
                  value={editingProject.projectType || 'Web Application'}
                  onChange={(e) => setEditingProject({ ...editingProject, projectType: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="Web Application">Web Application</option>
                  <option value="API">API</option>
                  <option value="Mobile Application">Mobile Application</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Status
                </label>
                <select
                  value={editingProject.status || 'Completed'}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Featured Image Upload with Icon / Image Component */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Featured Cover Image (Upload or URL) *"
                value={editingProject.featuredImage || ''}
                onChange={(url) => setEditingProject({ ...editingProject, featuredImage: url })}
                helperText="Upload a high-res project screenshot or paste a link"
                mode="image"
              />
            </div>

            {/* Technologies with Tech Tool Icon Selector */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-[#00007B]">
                  Technologies &amp; Tools Used *
                </label>
                <span className="text-[11px] font-mono text-[#00007B]/60">
                  Click a tech tool below to add it
                </span>
              </div>

              {/* Selected Tech Tools */}
              <div className="flex flex-wrap gap-2 min-h-8 p-2.5 bg-white border border-[#00007B]/15 rounded-xl">
                {(editingProject.technologies || []).map((t: string) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0F9A73]/15 text-[#00007B] border border-[#0F9A73]/30 font-bold"
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
                {(editingProject.technologies || []).length === 0 && (
                  <span className="text-xs text-[#00007B]/40 italic">
                    No tech tools added yet. Select from the quick tools below or type a custom tool name.
                  </span>
                )}
              </div>

              {/* Quick Tech Tool Add Badges */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-[#00007B]/70 font-semibold">
                  Quick Add Popular Tech Tools:
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                  {TECH_LIBRARY.map((item) => {
                    const isAdded = (editingProject.technologies || []).includes(item.name);
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
            </div>

            {/* Gallery Images with Upload & Preview */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B]">
                    Project Gallery &amp; Screenshots
                  </label>
                  <p className="text-[11px] text-[#00007B]/60">
                    Upload screenshots, mockups, or system architecture diagrams.
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    onChange={handleGalleryUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => galleryFileInputRef.current?.click()}
                    isLoading={isUploadingGallery}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1 text-[#0F9A73]" />
                    <span>Upload Image</span>
                  </Button>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(editingProject.galleryImages || []).map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border border-[#00007B]/20 bg-white group shadow-sm"
                  >
                    <img src={imgUrl} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {(editingProject.galleryImages || []).length === 0 && (
                  <div className="col-span-full py-4 text-center text-xs text-[#00007B]/50 font-mono border border-dashed border-[#00007B]/20 rounded-xl bg-white">
                    No additional screenshots uploaded. Click &quot;Upload Image&quot; to add gallery assets.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Live Application URL
                </label>
                <input
                  type="url"
                  value={editingProject.liveUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={editingProject.githubUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Short Description (cards preview) *
              </label>
              <textarea
                required
                rows={2}
                value={editingProject.shortDescription || ''}
                onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Full Description (case study overview) *
              </label>
              <textarea
                required
                rows={3}
                value={editingProject.fullDescription || ''}
                onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Core Engineering Challenge
                </label>
                <textarea
                  rows={2}
                  value={editingProject.challenges || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, challenges: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Architectural Solution
                </label>
                <textarea
                  rows={2}
                  value={editingProject.solutions || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, solutions: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Key Features (one per line)
              </label>
              <textarea
                rows={3}
                value={editingProject.keyFeaturesText || ''}
                onChange={(e) => setEditingProject({ ...editingProject, keyFeaturesText: e.target.value })}
                placeholder="Real-time WebSocket telemetry&#10;Role-based permissions"
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#00007B]">
                <input
                  type="checkbox"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                />
                <span className="font-semibold">Featured Project</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#00007B]">
                <input
                  type="checkbox"
                  checked={editingProject.published ?? true}
                  onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                />
                <span className="font-semibold">Published (Visible publicly)</span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                Save Project Case Study
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Project Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs text-[#00007B]">
              Are you sure you want to permanently delete this project? This will remove its public case study page and cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
