'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  AlertTriangle,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Check,
  Loader2,
  Move,
} from 'lucide-react';
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
  const [isReordering, setIsReordering] = useState(false);

  // Drag and Drop State
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Direct Position Jump Modal
  const [jumpSkill, setJumpSkill] = useState<Skill | null>(null);
  const [targetPosition, setTargetPosition] = useState<number>(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadSkills = async () => {
    try {
      const data = await api.getSkills();
      const sorted = [...data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      setSkills(sorted);
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

  // Reorder helper: persist updated skill order
  const saveReorderedSkills = async (newSkillsList: Skill[], message?: string) => {
    // Re-assign displayOrder sequentially (1-based)
    const normalized = newSkillsList.map((s, idx) => ({
      ...s,
      displayOrder: idx + 1,
    }));

    const previousSkills = skills;
    setSkills(normalized);
    setIsReordering(true);

    try {
      const orderedIds = normalized.map((s) => s.id);
      await api.reorderSkills(orderedIds);
      if (message) {
        toast.success(message);
      }
    } catch (err: any) {
      setSkills(previousSkills);
      toast.error(err.message || 'Failed to update skill order');
    } finally {
      setIsReordering(false);
    }
  };

  // Move single item Up or Down
  const handleMove = async (skillId: string, direction: 'up' | 'down') => {
    const currentList = [...filteredSkills];
    const currentIndex = currentList.findIndex((s) => s.id === skillId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const currentSkill = currentList[currentIndex];
    const targetSkill = currentList[targetIndex];

    let newSkills = [...skills];
    const fromIdx = newSkills.findIndex((s) => s.id === currentSkill.id);
    const toIdx = newSkills.findIndex((s) => s.id === targetSkill.id);

    if (fromIdx === -1 || toIdx === -1) return;

    // Move element
    const [moved] = newSkills.splice(fromIdx, 1);
    newSkills.splice(toIdx, 0, moved);

    await saveReorderedSkills(
      newSkills,
      `'${currentSkill.name}' moved ${direction === 'up' ? 'up' : 'down'}`
    );
  };

  // Jump to specific numeric position
  const handleJumpPositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jumpSkill) return;

    const currentIdx = skills.findIndex((s) => s.id === jumpSkill.id);
    if (currentIdx === -1) return;

    // Clamp desired position
    const targetIdx = Math.max(0, Math.min(targetPosition - 1, skills.length - 1));
    if (targetIdx === currentIdx) {
      setJumpSkill(null);
      return;
    }

    const newSkills = [...skills];
    const [moved] = newSkills.splice(currentIdx, 1);
    newSkills.splice(targetIdx, 0, moved);

    setJumpSkill(null);
    await saveReorderedSkills(
      newSkills,
      `'${jumpSkill.name}' moved to position #${targetIdx + 1}`
    );
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    const sourceId = draggedId || e.dataTransfer.getData('text/plain');
    setDraggedId(null);

    if (!sourceId || sourceId === targetId) return;

    let newSkills = [...skills];
    const fromIdx = newSkills.findIndex((s) => s.id === sourceId);
    const toIdx = newSkills.findIndex((s) => s.id === targetId);

    if (fromIdx === -1 || toIdx === -1) return;

    const [moved] = newSkills.splice(fromIdx, 1);
    newSkills.splice(toIdx, 0, moved);

    await saveReorderedSkills(
      newSkills,
      `Position updated: '${moved.name}' placed before '${skills[toIdx]?.name || 'target'}'`
    );
  };

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
          <h2 className="text-2xl font-extrabold text-[#00007B] tracking-tight">
            Skills &amp; Tooling Management
          </h2>
          <p className="text-xs text-[#00007B]/70 mt-1">
            Arrange display position, assign tool icons, categorize, and manage technical proficiencies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add New Skill</span>
          </Button>
        </div>
      </div>

      {/* Reorder & Placement Guide Card */}
      <div className="bg-[#f8fafd] border border-[#00007B]/15 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F9A73]/10 border border-[#0F9A73]/25 flex items-center justify-center shrink-0 text-[#0F9A73]">
            <ArrowUpDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#00007B]">Position &amp; Order Arrangement</h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#0F9A73]/15 text-[#0F9A73]">
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-[#00007B]/75 mt-0.5">
              Drag rows using the grip handle (<strong>⋮⋮</strong>), click the <strong>↑ / ↓</strong> buttons, or click a <strong>#Position badge</strong> to reorder. Skills appear in this exact sequence on the{' '}
              <Link href="/" target="_blank" className="text-[#0F9A73] underline font-bold hover:text-[#0b7456]">
                Home page
              </Link>{' '}
              and{' '}
              <Link href="/skills" target="_blank" className="text-[#0F9A73] underline font-bold hover:text-[#0b7456]">
                Skills taxonomy page
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {isReordering ? (
            <div className="flex items-center gap-2 text-xs font-mono text-[#0F9A73] font-bold bg-white border border-[#0F9A73]/30 px-3 py-1.5 rounded-xl shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating position...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-[#00007B]/70 font-medium bg-white border border-[#00007B]/15 px-3 py-1.5 rounded-xl shadow-xs">
              <Check className="w-3.5 h-3.5 text-[#0F9A73]" />
              <span>Positions in sync</span>
            </div>
          )}
        </div>
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

      {search.trim() !== '' && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <span>Search query active. Clear search to drag-and-drop or reorder the full skills catalogue.</span>
          <button
            onClick={() => setSearch('')}
            className="text-amber-900 font-bold underline ml-2 hover:text-amber-950"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Skills Table / Card Layout */}
      <div className="bg-white border border-[#00007B]/15 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#00007B]/10 bg-[#f8fafd] text-[#00007B] font-mono">
                <th className="py-3.5 px-4 w-36">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span>Position</span>
                  </div>
                </th>
                <th className="py-3.5 px-6">Skill / Tool Icon</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Proficiency</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00007B]/10">
              {filteredSkills.map((skill, index) => {
                const isDragging = draggedId === skill.id;
                const isOver = dragOverId === skill.id && draggedId !== skill.id;

                return (
                  <tr
                    key={skill.id}
                    draggable={!search && !isReordering}
                    onDragStart={(e) => handleDragStart(e, skill.id)}
                    onDragOver={(e) => handleDragOver(e, skill.id)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, skill.id)}
                    className={`transition-all duration-150 ${
                      isDragging
                        ? 'opacity-30 bg-[#f8fafd] border-dashed border-2 border-[#0F9A73]'
                        : isOver
                        ? 'bg-[#0F9A73]/10 border-t-2 border-[#0F9A73]'
                        : 'hover:bg-[#f8fafd]'
                    }`}
                  >
                    {/* Position / Arrange Controls Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* Drag Handle */}
                        <div
                          className={`p-1.5 rounded-lg text-[#00007B]/40 hover:text-[#00007B] hover:bg-[#00007B]/5 transition-colors ${
                            search ? 'opacity-30 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
                          }`}
                          title={search ? 'Clear search to drag' : 'Drag to reorder position'}
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Interactive Position Badge */}
                        <button
                          type="button"
                          onClick={() => {
                            setJumpSkill(skill);
                            setTargetPosition(skill.displayOrder || index + 1);
                          }}
                          title="Click to jump to specific position number"
                          className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-[#00007B]/5 hover:bg-[#0F9A73]/15 text-[#00007B] hover:text-[#0F9A73] border border-[#00007B]/15 hover:border-[#0F9A73]/40 transition-all flex items-center gap-1 group/pos shrink-0"
                        >
                          <span>#{skill.displayOrder || index + 1}</span>
                          <Move className="w-2.5 h-2.5 opacity-0 group-hover/pos:opacity-100 transition-opacity" />
                        </button>

                        {/* Up / Down Move Buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0 || isReordering}
                            onClick={() => handleMove(skill.id, 'up')}
                            className="p-1 rounded-md text-[#00007B]/50 hover:text-[#0F9A73] hover:bg-[#0F9A73]/15 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#00007B]/50 transition-colors"
                            title="Move Up 1 Position"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === filteredSkills.length - 1 || isReordering}
                            onClick={() => handleMove(skill.id, 'down')}
                            className="p-1 rounded-md text-[#00007B]/50 hover:text-[#0F9A73] hover:bg-[#0F9A73]/15 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#00007B]/50 transition-colors"
                            title="Move Down 1 Position"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Skill Info */}
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
                );
              })}
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

      {/* Jump to Position Modal */}
      <Modal
        isOpen={!!jumpSkill}
        onClose={() => setJumpSkill(null)}
        title="Reposition Skill"
        maxWidth="sm"
      >
        {jumpSkill && (
          <form onSubmit={handleJumpPositionSubmit} className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/15">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#00007B]/15 flex items-center justify-center shrink-0">
                <TechIcon name={jumpSkill.icon || jumpSkill.name} size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#00007B]">{jumpSkill.name}</h4>
                <p className="text-xs text-[#00007B]/60 font-mono">
                  Current Position: #{jumpSkill.displayOrder || 1} of {skills.length}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Target Position Number (1 - {skills.length})
              </label>
              <input
                type="number"
                required
                min={1}
                max={skills.length}
                value={targetPosition}
                onChange={(e) => setTargetPosition(parseInt(e.target.value, 10) || 1)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] font-mono text-sm focus:outline-none focus:border-[#0F9A73]"
              />
              <p className="text-[11px] text-[#00007B]/60 mt-1">
                Setting position to #1 will move this skill to the very top across your portfolio.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setJumpSkill(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isReordering}>
                Set Position
              </Button>
            </div>
          </form>
        )}
      </Modal>

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
                  Display Order / Position
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
