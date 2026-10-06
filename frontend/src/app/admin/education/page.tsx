'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  Calendar,
  MapPin,
  AlertTriangle,
  ExternalLink,
  Award,
  Search,
  Building,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Education } from '../../../types';
import { formatDate } from '../../../lib/utils';
import { toast } from 'sonner';

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadEducations = async () => {
    try {
      const data = await api.getEducations();
      setEducations(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch {
      toast.error('Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducations();
  }, []);

  const handleOpenAdd = () => {
    setEditingEdu({
      institution: '',
      institutionLogo: '',
      degree: 'Bachelor of Science (B.S.)',
      fieldOfStudy: 'Computer Science',
      location: 'San Francisco, CA',
      startDate: '2016-08-15',
      endDate: '2020-05-20',
      currentlyStudying: false,
      grade: '3.85 / 4.00',
      description: 'Focused on distributed systems, algorithms, database internals, and software engineering.',
      achievementsText: 'Dean\'s Honor List for 6 Consecutive Semesters\nLead Undergraduate Teaching Assistant for Data Structures',
      website: '',
      displayOrder: educations.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu({
      ...edu,
      institutionLogo: edu.institutionLogo || '',
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      achievementsText: (edu.achievements || []).join('\n'),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu.institution || !editingEdu.degree) {
      toast.error('Please enter institution and degree');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...editingEdu,
        institutionLogo: editingEdu.institutionLogo || null,
        website: editingEdu.website || null,
        achievements: editingEdu.achievementsText
          ? editingEdu.achievementsText.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : [],
        endDate: editingEdu.currentlyStudying ? null : editingEdu.endDate || null,
      };

      if (editingEdu.id) {
        await api.updateEducation(editingEdu.id, payload);
        toast.success(`Education at '${editingEdu.institution}' updated`);
      } else {
        await api.createEducation(payload);
        toast.success(`Education entry created`);
      }
      setIsModalOpen(false);
      loadEducations();
    } catch (err: any) {
      toast.error(err.message || 'Error saving education');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteEducation(deleteConfirmId);
      toast.success('Education entry deleted');
      setDeleteConfirmId(null);
      loadEducations();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting education');
    }
  };

  const filtered = educations.filter(
    (e) =>
      e.institution.toLowerCase().includes(search.toLowerCase()) ||
      e.degree.toLowerCase().includes(search.toLowerCase()) ||
      e.fieldOfStudy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Metrics Banner */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30 text-xs font-mono font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Foundation</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#00007B] tracking-tight">
              Education &amp; Academic Honors
            </h1>
            <p className="text-xs sm:text-sm text-[#00007B]/70 max-w-2xl leading-relaxed">
              Curate academic degrees, foundational coursework, research projects, scholarships, and academic honors.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="bg-[#0F9A73] hover:bg-[#12b88a] text-white shadow-md font-bold self-start lg:self-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Education</span>
          </Button>
        </div>

        {/* Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#00007B]/10">
          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Total Degrees
            </div>
            <div className="text-xl font-extrabold text-[#00007B] mt-0.5">
              {educations.length} Credentials
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Primary Field
            </div>
            <div className="text-sm font-bold text-[#0F9A73] mt-1 truncate">
              {educations[0]?.fieldOfStudy || 'Computer Science'}
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Highest Degree
            </div>
            <div className="text-sm font-bold text-[#00007B] mt-1 truncate">
              {educations[0]?.degree || 'B.S. in Computer Science'}
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Verification
            </div>
            <div className="text-xs font-mono text-[#0F9A73] mt-1 font-bold">
              Accredited
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
            placeholder="Search institution, degree, or major..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-xs placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
          />
        </div>
        <div className="text-xs font-mono text-[#00007B]/60">
          Showing {filtered.length} of {educations.length} records
        </div>
      </div>

      {/* Education Cards */}
      <div className="space-y-5">
        {filtered.map((edu) => (
          <div
            key={edu.id}
            className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#0F9A73] hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-2 shadow-inner shrink-0">
                  {edu.institutionLogo ? (
                    <TechIcon name={edu.institutionLogo} size={32} />
                  ) : (
                    <GraduationCap className="w-7 h-7 text-[#00007B]/40" />
                  )}
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-extrabold text-[#00007B] tracking-tight">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h3>
                    {edu.currentlyStudying && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F9A73] animate-ping" />
                        <span>Currently Enrolled</span>
                      </span>
                    )}
                    {edu.grade && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/30">
                        GPA: {edu.grade}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-[#00007B]">
                    {edu.website ? (
                      <a
                        href={edu.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#0F9A73] transition-colors inline-flex items-center gap-1 hover:underline"
                      >
                        <span>{edu.institution}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#0F9A73]" />
                      </a>
                    ) : (
                      <span>{edu.institution}</span>
                    )}
                    <span className="text-[#00007B]/30">•</span>
                    <span className="text-xs font-mono text-[#00007B]/60 font-normal">
                      Order #{edu.displayOrder}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#00007B]/70 pt-0.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                      <span>
                        {formatDate(edu.startDate)} — {edu.currentlyStudying ? 'Present' : formatDate(edu.endDate)}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0F9A73]" />
                      <span>{edu.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(edu)}
                  className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirmId(edu.id)}
                  className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Description & Honors */}
            {edu.description && (
              <p className="mt-4 pt-4 border-t border-[#00007B]/10 text-xs sm:text-sm text-[#00007B]/80 leading-relaxed max-w-4xl">
                {edu.description}
              </p>
            )}

            {edu.achievements && edu.achievements.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#00007B]/10">
                <div className="text-[11px] font-mono uppercase font-bold text-[#00007B]/70 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Academic Honors &amp; Coursework Milestones</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {edu.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#00007B]/80 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9A73] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="bg-white border border-[#00007B]/15 rounded-3xl p-12 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-[#00007B]/30 mx-auto" />
            <div className="text-base font-bold text-[#00007B]">No education records found</div>
            <p className="text-xs text-[#00007B]/60 max-w-sm mx-auto">
              Click &quot;Add Education&quot; to begin building your academic profile.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEdu?.id ? 'Edit Academic Qualification' : 'Add Academic Qualification'}
        maxWidth="3xl"
      >
        {editingEdu && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Degree / Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science, Master of Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Field of Study / Major *
                </label>
                <input
                  type="text"
                  required
                  value={editingEdu.fieldOfStudy || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Computer Science & Systems Engineering"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Institution / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  placeholder="e.g. University of California, Berkeley"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Campus Location
                </label>
                <input
                  type="text"
                  value={editingEdu.location || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                  placeholder="e.g. Berkeley, CA"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            {/* Institution Logo / Tech Badge */}
            <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Institution Logo or Academic Crest"
                value={editingEdu.institutionLogo || ''}
                onChange={(logoVal) => setEditingEdu({ ...editingEdu, institutionLogo: logoVal })}
                helperText="Upload university emblem, pick an icon, or enter image URL"
                mode="all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={editingEdu.startDate || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, startDate: e.target.value })}
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
                      checked={editingEdu.currentlyStudying || false}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          currentlyStudying: e.target.checked,
                          endDate: e.target.checked ? '' : editingEdu.endDate,
                        })
                      }
                      className="w-4 h-4 rounded text-[#0F9A73] accent-[#0F9A73] border-[#00007B]/20"
                    />
                    <span>Currently Studying</span>
                  </label>
                </div>
                <input
                  type="date"
                  disabled={editingEdu.currentlyStudying}
                  value={editingEdu.endDate || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] disabled:opacity-40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  GPA / Academic Honors
                </label>
                <input
                  type="text"
                  value={editingEdu.grade || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                  placeholder="e.g. 3.90 / 4.00, Summa Cum Laude"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Official Institution Website URL
                </label>
                <input
                  type="url"
                  value={editingEdu.website || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, website: e.target.value })}
                  placeholder="https://berkeley.edu"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Description / Core Curricular Focus
              </label>
              <textarea
                rows={2}
                value={editingEdu.description || ''}
                onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                placeholder="Core coursework: Distributed Systems, Operating Systems, Compilers..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Key Honors &amp; Achievements (one per line)
              </label>
              <textarea
                rows={3}
                value={editingEdu.achievementsText || ''}
                onChange={(e) => setEditingEdu({ ...editingEdu, achievementsText: e.target.value })}
                placeholder="Dean's Honor List&#10;Lead Teaching Assistant for CS61B"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Display Order Sequence
              </label>
              <input
                type="number"
                value={editingEdu.displayOrder || 1}
                onChange={(e) =>
                  setEditingEdu({ ...editingEdu, displayOrder: parseInt(e.target.value, 10) || 1 })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
              />
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="shadow-md">
                Save Education Record
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
              Are you sure you want to permanently delete this education record?
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
