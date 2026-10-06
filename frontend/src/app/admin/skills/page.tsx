'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Skill } from '../../../types';
import { toast } from 'sonner';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills = skills.filter((s) => {
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingSkill({
      name: '',
      category: 'Frontend',
      proficiency: 85,
      icon: '',
      description: '',
      displayOrder: skills.length + 1,
      featured: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name || !editingSkill.category) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingSkill.id) {
        await api.updateSkill(editingSkill.id, editingSkill);
        toast.success(`Skill '${editingSkill.name}' updated`);
      } else {
        await api.createSkill(editingSkill);
        toast.success(`Skill '${editingSkill.name}' created`);
      }
      setIsModalOpen(false);
      loadSkills();
    } catch (err: any) {
      toast.error(err.message || 'Error saving skill');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteSkill(deleteConfirmId);
      toast.success('Skill deleted successfully');
      setDeleteConfirmId(null);
      loadSkills();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting skill');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#00007B] tracking-tight">Skills &amp; Tooling Management</h2>
          <p className="text-xs text-[#00007B]/70 mt-1">
            Create, categorize, reorder, assign tool icons, and update skill proficiencies.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Skill</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#00007B]/15 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#00007B]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-xs placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-[#0F9A73] text-white font-bold shadow-sm'
                  : 'bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B]/70 hover:text-[#00007B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Table / Card Layout */}
      <div className="bg-white border border-[#00007B]/15 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#00007B]/10 bg-[#f8fafd] text-[#00007B] font-mono">
                <th className="py-3.5 px-6">Skill / Tool Icon</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Proficiency</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00007B]/10">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-[#f8fafd] transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#00007B]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center shrink-0 shadow-sm p-1">
                        <TechIcon name={skill.icon || skill.name} size={22} />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#00007B]">{skill.name}</span>
                        {skill.description && (
                          <span className="block text-[11px] font-normal text-[#00007B]/70 line-clamp-1">
                            {skill.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-[#0F9A73] font-semibold">{skill.category}</td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-[#00007B]/10 overflow-hidden">
                        <div
                          className="h-full bg-[#0F9A73] rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="font-mono text-[#00007B] font-bold">{skill.proficiency}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-[#00007B]/70">#{skill.displayOrder}</td>

                  <td className="py-4 px-4">
                    {skill.featured ? (
                      <Badge variant="cyan" size="sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    ) : (
                      <span className="text-[#00007B]/40">—</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        className="p-1.5 rounded-lg bg-white border border-[#00007B]/20 text-[#00007B] hover:text-[#0F9A73] hover:border-[#0F9A73] transition-colors"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(skill.id)}
                        className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSkills.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-[#00007B]/60 font-mono">
                    No skills found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill?.id ? 'Edit Skill & Tool' : 'Create New Skill'}
      >
        {editingSkill && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Skill / Tool Name *
              </label>
              <input
                type="text"
                required
                value={editingSkill.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  // If icon is not explicitly selected yet, default icon to skill name
                  setEditingSkill({
                    ...editingSkill,
                    name: val,
                    icon: editingSkill.icon || val.toLowerCase().replace(/[^a-z0-9]/g, ''),
                  });
                }}
                placeholder="e.g. Next.js, Docker, PostgreSQL, React"
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
              />
            </div>

            {/* Tech Icon / Image Upload Functionality */}
            <div className="pt-1">
              <IconOrImageUpload
                label="Tech Tool Icon or Image"
                value={editingSkill.icon || ''}
                onChange={(newIcon) => setEditingSkill({ ...editingSkill, icon: newIcon })}
                helperText="Select a tech logo badge, upload your own icon/image, or enter a URL"
                mode="all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Category *
                </label>
                <select
                  value={editingSkill.category || 'Frontend'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps / Cloud">DevOps / Cloud</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Tools & Architecture">Tools & Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Proficiency (0 - 100) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={editingSkill.proficiency ?? 80}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      proficiency: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Short Description
              </label>
              <textarea
                rows={2}
                value={editingSkill.description || ''}
                onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                placeholder="Key concepts, architecture patterns, or production use cases"
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingSkill.displayOrder || 0}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      displayOrder: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#00007B]">
                  <input
                    type="checkbox"
                    checked={editingSkill.featured || false}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                  />
                  <span className="font-semibold">Featured Skill</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                Save Skill
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Skill Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs text-[#00007B]">
              Are you sure you want to permanently remove this skill? This action cannot be undone.
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
