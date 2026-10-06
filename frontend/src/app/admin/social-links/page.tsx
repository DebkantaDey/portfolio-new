'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { SocialLink } from '../../../types';
import { toast } from 'sonner';

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadLinks = async () => {
    try {
      const data = await api.getSocialLinks();
      setLinks(data);
    } catch {
      toast.error('Failed to load social links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleOpenAdd = () => {
    setEditingLink({
      platform: '',
      url: 'https://',
      icon: 'github',
      isActive: true,
      displayOrder: links.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (l: SocialLink) => {
    setEditingLink({
      ...l,
      icon: l.icon || l.platform.toLowerCase().replace(/[^a-z0-9]/g, ''),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink.platform || !editingLink.url) {
      toast.error('Please enter platform and URL');
      return;
    }

    setIsSaving(true);
    try {
      if (editingLink.id) {
        await api.updateSocialLink(editingLink.id, editingLink);
        toast.success(`Social link updated`);
      } else {
        await api.createSocialLink(editingLink);
        toast.success(`Social link added`);
      }
      setIsModalOpen(false);
      loadLinks();
    } catch (err: any) {
      toast.error(err.message || 'Error saving link');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteSocialLink(deleteConfirmId);
      toast.success('Social link removed');
      setDeleteConfirmId(null);
      loadLinks();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting link');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#00007B] tracking-tight">Social &amp; Developer Profiles</h2>
          <p className="text-xs text-[#00007B]/70 mt-1">
            Manage links and official icons for GitHub, LinkedIn, Twitter/X, Medium, Dev.to, and technical portals.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Social Link</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-white border border-[#00007B]/15 p-5 rounded-2xl flex items-center justify-between hover:border-[#0F9A73] hover:shadow-lg transition-all shadow-sm"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center shrink-0 p-1.5 shadow-inner">
                <TechIcon name={link.icon || link.platform} size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-[#00007B] block truncate">
                  {link.platform}
                </span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#0F9A73] hover:underline font-mono truncate block mt-0.5"
                >
                  {link.url}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit(link)}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="danger" size="sm" onClick={() => setDeleteConfirmId(link.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {links.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-sm font-mono text-[#00007B]/60 bg-white border border-[#00007B]/15 rounded-2xl">
            No social profiles added yet. Click &quot;Add Social Link&quot; to configure your developer links.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLink?.id ? 'Edit Social Profile' : 'Add Social Profile'}
      >
        {editingLink && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Platform Name *
              </label>
              <input
                type="text"
                required
                value={editingLink.platform || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditingLink({
                    ...editingLink,
                    platform: val,
                    icon: editingLink.icon || val.toLowerCase().replace(/[^a-z0-9]/g, ''),
                  });
                }}
                placeholder="GitHub, LinkedIn, Twitter, Dev.to, Discord..."
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
              />
            </div>

            {/* Icon Picker / Upload for Social Platforms & Tech Tools */}
            <div className="pt-1">
              <IconOrImageUpload
                label="Platform Icon or Custom Tool Logo"
                value={editingLink.icon || ''}
                onChange={(newIcon) => setEditingLink({ ...editingLink, icon: newIcon })}
                helperText="Select an official branded icon, upload custom SVG/image, or enter URL"
                mode="all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Profile URL *
              </label>
              <input
                type="url"
                required
                value={editingLink.url || ''}
                onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm font-mono focus:outline-none focus:border-[#0F9A73]"
              />
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                Save Link
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to delete this social link?
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
