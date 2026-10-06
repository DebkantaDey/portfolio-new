'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Award, ExternalLink, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TechIcon } from '../../../components/common/TechIcon';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Certification } from '../../../types';
import { formatDate } from '../../../lib/utils';
import { toast } from 'sonner';

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadCertifications = async () => {
    try {
      const data = await api.getCertifications();
      setCertifications(data);
    } catch {
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const handleOpenAdd = () => {
    setEditingCert({
      title: '',
      issuingOrganization: 'Amazon Web Services (AWS)',
      organizationLogo: 'aws',
      certificateImage: '',
      issueDate: new Date().toISOString().split('T')[0],
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      displayOrder: certifications.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setEditingCert({
      ...cert,
      organizationLogo: cert.organizationLogo || '',
      certificateImage: cert.certificateImage || '',
      issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
      expirationDate: cert.expirationDate ? new Date(cert.expirationDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert.title || !editingCert.issuingOrganization) {
      toast.error('Please enter title and issuing organization');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCert.id) {
        await api.updateCertification(editingCert.id, editingCert);
        toast.success(`Certification '${editingCert.title}' updated`);
      } else {
        await api.createCertification(editingCert);
        toast.success(`Certification created`);
      }
      setIsModalOpen(false);
      loadCertifications();
    } catch (err: any) {
      toast.error(err.message || 'Error saving certification');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteCertification(deleteConfirmId);
      toast.success('Certification deleted');
      setDeleteConfirmId(null);
      loadCertifications();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting certification');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#00007B] tracking-tight">Certifications Management</h2>
          <p className="text-xs text-[#00007B]/70 mt-1">
            Maintain industry certificates, verification badges, issuer logos, and credential IDs.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Certification</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border border-[#00007B]/15 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-lg transition-all shadow-sm"
          >
            <div>
              {/* Organization & Icon Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                  {cert.organizationLogo ? (
                    <TechIcon name={cert.organizationLogo} size={28} />
                  ) : (
                    <Award className="w-6 h-6 text-[#0F9A73]" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#00007B] leading-tight">{cert.title}</h3>
                  <p className="text-xs font-mono text-[#0F9A73] mt-0.5 font-semibold">
                    {cert.issuingOrganization}
                  </p>
                </div>
              </div>

              {/* Certificate Image Preview if uploaded */}
              {cert.certificateImage && (
                <div className="mb-4 rounded-xl overflow-hidden border border-[#00007B]/15 aspect-video bg-[#f8fafd]">
                  <img
                    src={cert.certificateImage}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-xs text-[#00007B]/80 line-clamp-3 mb-4 leading-relaxed">
                {cert.description || 'Verified engineering certification.'}
              </p>

              <div className="text-[11px] font-mono text-[#00007B]/70 space-y-1 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <span>Issued: {formatDate(cert.issueDate)}</span>
                </div>
                {cert.credentialId && (
                  <div>
                    ID: <span className="font-bold text-[#00007B]">{cert.credentialId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex items-center justify-between mt-2">
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono font-bold text-[#0F9A73] hover:underline inline-flex items-center gap-1"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[11px] font-mono text-[#00007B]/40">No verification link</span>
              )}

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(cert)}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => setDeleteConfirmId(cert.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {certifications.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-sm font-mono text-[#00007B]/60 bg-white border border-[#00007B]/15 rounded-2xl">
            No certifications added yet. Click &quot;Add Certification&quot; to create one.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert?.id ? 'Edit Certification' : 'Add Certification'}
        maxWidth="2xl"
      >
        {editingCert && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Certification Title *
              </label>
              <input
                type="text"
                required
                value={editingCert.title || ''}
                onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                placeholder="e.g. AWS Certified Solutions Architect - Professional"
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={editingCert.issuingOrganization || ''}
                onChange={(e) => setEditingCert({ ...editingCert, issuingOrganization: e.target.value })}
                placeholder="e.g. Amazon Web Services (AWS), Google Cloud, CNCF"
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
              />
            </div>

            {/* Organization Icon / Logo Upload */}
            <div className="p-3.5 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Organization Logo or Tech Tool Badge"
                value={editingCert.organizationLogo || ''}
                onChange={(iconVal) => setEditingCert({ ...editingCert, organizationLogo: iconVal })}
                helperText="Pick AWS, GCP, Docker, or upload the issuer's logo image"
                mode="all"
              />
            </div>

            {/* Certificate Credential Image Upload */}
            <div className="p-3.5 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
              <IconOrImageUpload
                label="Certificate Document / Badge Image (Optional)"
                value={editingCert.certificateImage || ''}
                onChange={(imgVal) => setEditingCert({ ...editingCert, certificateImage: imgVal })}
                helperText="Upload official certificate scan, digital badge, or enter image link"
                mode="image"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={editingCert.issueDate || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={editingCert.expirationDate || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, expirationDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={editingCert.credentialId || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                  placeholder="e.g. AWS-PSA-12948"
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                  Verification URL
                </label>
                <input
                  type="url"
                  value={editingCert.credentialUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                  placeholder="https://www.credly.com/..."
                  className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                value={editingCert.description || ''}
                onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                placeholder="Skills assessed and architectural competencies demonstrated"
                className="w-full px-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
              />
            </div>

            <div className="pt-4 border-t border-[#00007B]/10 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                Save Certification
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
              Are you sure you want to delete this certification?
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
