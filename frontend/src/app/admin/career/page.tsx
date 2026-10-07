'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Building2,
  Search,
  Globe,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Link2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { api } from '../../../lib/api';
import { CareerOpportunity } from '../../../types';
import { toast } from 'sonner';

const formatExternalUrl = (url?: string | null): string => {
  if (!url) return '#';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const cleanUrlDisplay = (url?: string | null): string => {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/i, '');
};

const extractDomain = (url: string, companyName?: string): string => {
  if (url && url.trim()) {
    try {
      const formatted = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
      const parsed = new URL(formatted);
      let domain = parsed.hostname.replace(/^www\./i, '');
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (
        (domain.includes('lever.co') ||
          domain.includes('greenhouse.io') ||
          domain.includes('ashbyhq.com') ||
          domain.includes('workday.com')) &&
        companyName?.trim()
      ) {
        domain = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
      } else if (
        (domain.includes('lever.co') ||
          domain.includes('greenhouse.io') ||
          domain.includes('ashbyhq.com')) &&
        parts.length > 0
      ) {
        domain = `${parts[0].toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
      }
      return domain;
    } catch {
      // not a full url yet
    }
  }
  if (companyName && companyName.trim()) {
    return `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  }
  return '';
};

const getAutoCompanyLogo = (companyName: string, careerUrl: string): string => {
  const domain = extractDomain(careerUrl, companyName);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

// Company Logo component with automatic fallback
const CompanyLogo = ({
  logoUrl,
  careerUrl,
  companyName,
  size = 48,
}: {
  logoUrl?: string | null;
  careerUrl?: string | null;
  companyName: string;
  size?: number;
}) => {
  const domain = extractDomain(careerUrl || '', companyName);
  const primarySrc = logoUrl || (domain ? `https://logo.clearbit.com/${domain}` : '');
  const [src, setSrc] = useState(primarySrc);
  const [fallbackStep, setFallbackStep] = useState(0);

  useEffect(() => {
    const newSrc = logoUrl || (domain ? `https://logo.clearbit.com/${domain}` : '');
    setSrc(newSrc);
    setFallbackStep(0);
  }, [logoUrl, careerUrl, companyName, domain]);

  const handleError = () => {
    if (fallbackStep === 0 && domain) {
      setFallbackStep(1);
      setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setFallbackStep(2);
      setSrc('');
    }
  };

  if (!src || fallbackStep === 2) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-2xl bg-[#00007B]/5 border border-[#00007B]/15 flex items-center justify-center font-black text-[#00007B] text-lg uppercase select-none shrink-0 shadow-inner"
      >
        {companyName ? companyName.charAt(0) : <Building2 className="w-5 h-5 text-[#00007B]/40" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={companyName || 'Company Logo'}
      onError={handleError}
      style={{ width: size, height: size }}
      className="rounded-2xl object-contain p-2 bg-white border border-[#00007B]/15 shrink-0 shadow-xs"
    />
  );
};

export default function AdminCareerPage() {
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [careerUrl, setCareerUrl] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadOpportunities = async () => {
    try {
      const data = await api.getCareerOpportunities();
      setOpportunities(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch (err: any) {
      toast.error('Failed to load career opportunities: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setCompanyName('');
    setCareerUrl('');
    setCompanyLogo('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (opp: CareerOpportunity) => {
    setEditingId(opp.id);
    setCompanyName(opp.companyName || '');
    const currentLink = opp.careerUrl || opp.jobUrl || opp.applicationUrl || '';
    setCareerUrl(currentLink);
    setCompanyLogo(opp.companyLogo || '');
    setIsModalOpen(true);
  };

  // Update auto-logo in modal when companyName or careerUrl changes
  useEffect(() => {
    if (isModalOpen) {
      const autoLogo = getAutoCompanyLogo(companyName, careerUrl);
      setCompanyLogo(autoLogo);
    }
  }, [companyName, careerUrl, isModalOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = companyName.trim();
    const cleanLink = careerUrl.trim();

    if (!cleanName) {
      toast.error('Please enter the Company Name');
      return;
    }
    if (!cleanLink) {
      toast.error('Please enter the Career Page Link');
      return;
    }

    setIsSaving(true);
    try {
      const formattedUrl = formatExternalUrl(cleanLink);
      const autoLogo = companyLogo || getAutoCompanyLogo(cleanName, formattedUrl);

      const payload = {
        companyName: cleanName,
        careerUrl: formattedUrl,
        jobUrl: formattedUrl,
        applicationUrl: formattedUrl,
        companyLogo: autoLogo,
        jobTitle: `${cleanName} Career Opportunities`,
        location: 'Remote / Global',
        jobDescription: `Official careers portal and engineering opportunities at ${cleanName}.`,
        status: 'Open',
        displayOrder: editingId ? undefined : opportunities.length + 1,
      };

      if (editingId) {
        await api.updateCareerOpportunity(editingId, payload);
        toast.success(`Career page for ${cleanName} updated!`);
      } else {
        await api.createCareerOpportunity(payload);
        toast.success(`Career page for ${cleanName} added!`);
      }
      setIsModalOpen(false);
      loadOpportunities();
    } catch (err: any) {
      toast.error(err.message || 'Error saving career link');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteCareerOpportunity(deleteConfirmId);
      toast.success('Company career link deleted');
      setDeleteConfirmId(null);
      loadOpportunities();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting opportunity');
    }
  };

  const filtered = opportunities.filter((opp) => {
    const q = search.toLowerCase();
    const linkStr = (opp.careerUrl || opp.jobUrl || opp.applicationUrl || '').toLowerCase();
    return (
      opp.companyName.toLowerCase().includes(q) ||
      linkStr.includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/25 text-xs font-mono font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Private Admin Panel • Not visible on public pages</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#00007B] tracking-tight">
              Company Career Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-[#00007B]/70 max-w-2xl leading-relaxed">
              Add target companies and their career page links (e.g. Amazon: <span className="font-mono text-[#0F9A73] font-semibold">https://amazon.com/career</span>). Logos are fetched automatically. Click any link to open in another tab.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="bg-[#0F9A73] hover:bg-[#12b88a] text-white shadow-md font-bold self-start lg:self-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Company Link</span>
          </Button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#00007B]/10">
          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Tracked Companies
            </div>
            <div className="text-xl font-extrabold text-[#00007B] mt-0.5">
              {opportunities.length}
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              Automatic Logos
            </div>
            <div className="text-sm font-bold text-[#0F9A73] mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0F9A73]" />
              <span>Auto-Fetched</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#00007B]/10 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-mono text-[#00007B]/60 uppercase font-semibold">
              External Redirection
            </div>
            <div className="text-xs font-mono text-[#00007B] mt-1 font-semibold flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-[#0F9A73]" />
              <span>Opens in New Tab</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#00007B]/15 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#00007B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company or career link..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-xs placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
          />
        </div>
        <div className="text-xs font-mono text-[#00007B]/60 hidden sm:block">
          Showing {filtered.length} of {opportunities.length} companies
        </div>
      </div>

      {/* Career List Section */}
      <div className="bg-white border border-[#00007B]/15 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#00007B]/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#00007B] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0F9A73]" />
            <span>Company Career Portals List</span>
          </h2>
          <span className="text-xs font-mono text-[#0F9A73] font-semibold bg-[#0F9A73]/10 px-3 py-1 rounded-full">
            {opportunities.length} Companies Added
          </span>
        </div>

        {/* List Items */}
        <div className="divide-y divide-[#00007B]/10">
          {filtered.map((opp) => {
            const link = opp.careerUrl || opp.jobUrl || opp.applicationUrl || '';
            const externalHref = formatExternalUrl(link);

            return (
              <div
                key={opp.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#f8fafd]/80 transition-colors group"
              >
                {/* Left: Company Logo, Name & Link */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <CompanyLogo
                    logoUrl={opp.companyLogo}
                    careerUrl={link}
                    companyName={opp.companyName}
                    size={52}
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#00007B] tracking-tight truncate">
                        {opp.companyName}
                      </h3>
                    </div>

                    {/* Company Career Link - Clickable redirection in another tab */}
                    {link && (
                      <a
                        href={externalHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0F9A73] hover:underline group/link truncate max-w-full"
                        title={`Open ${opp.companyName} career page: ${link}`}
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0 text-[#0F9A73]" />
                        <span className="truncate">{cleanUrlDisplay(link)}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-[#0F9A73] group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#00007B]/10">
                  {/* Click to Redirect in Another Tab Button */}
                  <a
                    href={externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#0F9A73] hover:bg-[#12b88a] text-white text-xs font-mono font-bold shadow-sm inline-flex items-center gap-1.5 transition-all shrink-0"
                    title={`Redirect to ${opp.companyName} career page in another tab`}
                  >
                    <span>Visit Career Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(opp)}
                    className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73] px-3"
                    title="Edit company or link"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirmId(opp.id)}
                    className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white px-3"
                    title="Delete company"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && !loading && (
            <div className="p-12 text-center text-sm font-mono text-[#00007B]/60">
              {search ? (
                <span>No companies found matching &quot;{search}&quot;.</span>
              ) : (
                <div className="space-y-3">
                  <p>No company career portals added yet.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenAdd}
                    className="bg-[#0F9A73] hover:bg-[#12b88a] text-white"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Add First Company</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal (Only Company Name and Career Page Link) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? `Edit Company Career Link: ${companyName}` : 'Add Company Career Page Link'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-5">
          {/* Company Name Input */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Amazon, Google, Stripe, Microsoft, Netflix"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
              autoFocus
            />
          </div>

          {/* Company Career Page Link Input */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#0F9A73]" />
                Career Page Link *
              </span>
              <span className="text-[11px] text-[#0F9A73] font-normal font-mono">
                e.g. https://amazon.com/career
              </span>
            </label>
            <input
              type="text"
              required
              value={careerUrl}
              onChange={(e) => setCareerUrl(e.target.value)}
              placeholder="https://amazon.com/career or amazon.jobs"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm font-mono focus:outline-none focus:border-[#0F9A73]"
            />
            <p className="text-[11px] text-[#00007B]/60 font-mono mt-1">
              Clicking the link will redirect to this URL in another tab.
            </p>
          </div>

          {/* Automatic Logo Fetching Preview */}
          <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00007B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0F9A73]" />
                Company Logo (Automatically Fetched)
              </span>
              {(companyName || careerUrl) && (
                <span className="text-[11px] font-mono text-[#0F9A73] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Auto-detected
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <CompanyLogo
                logoUrl={companyLogo}
                careerUrl={careerUrl}
                companyName={companyName}
                size={54}
              />
              <div className="text-xs text-[#00007B]/70 space-y-0.5">
                <div className="font-bold text-[#00007B]">
                  {companyName || 'Enter company name above'}
                </div>
                <div className="text-[11px] text-[#00007B]/50 font-mono">
                  {careerUrl
                    ? `Domain: ${extractDomain(careerUrl, companyName) || 'detected'}`
                    : 'Logo automatically appears as you type'}
                </div>
              </div>
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="pt-3 border-t border-[#00007B]/10 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              className="bg-[#0F9A73] hover:bg-[#12b88a] text-white shadow-md font-bold"
            >
              {editingId ? 'Update Company' : 'Save Company Link'}
            </Button>
          </div>
        </form>
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
              Are you sure you want to remove this company career link?
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
            >
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
