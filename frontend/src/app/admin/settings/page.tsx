'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Save,
  RotateCcw,
  Sparkles,
  Palette,
  Type,
  User,
  Layout,
  FileText,
  Layers,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  Eye,
  Info,
  Terminal,
  ArrowRight,
  Download,
  Mail,
  MapPin,
  Clock,
  Laptop,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../lib/api';
import { Statistic } from '../../../types';
import { toast } from 'sonner';
import { useSettings, DEFAULT_SETTINGS } from '@/context/SettingsContext';

type TabKey = 'theme' | 'typography' | 'identity' | 'hero' | 'footer' | 'stats' | 'seo';

const COLOR_PRESETS = [
  {
    id: 'navy-emerald',
    name: 'Royal Navy & Emerald',
    description: 'Signature brand palette with deep royal navy and vivid emerald highlights',
    primary: '#00007B',
    accent: '#0F9A73',
    bg: '#ffffff',
    text: '#00007B',
    surface: '#f8fafd',
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Indigo & Cyan',
    description: 'Ultra-modern deep indigo paired with luminous electric cyan',
    primary: '#1E1B4B',
    accent: '#06B6D4',
    bg: '#ffffff',
    text: '#1E1B4B',
    surface: '#f0f9ff',
  },
  {
    id: 'midnight-amber',
    name: 'Midnight Slate & Amber',
    description: 'Warm executive palette with dark slate and glowing amber accents',
    primary: '#0F172A',
    accent: '#F59E0B',
    bg: '#ffffff',
    text: '#0F172A',
    surface: '#f8fafc',
  },
  {
    id: 'forest-mint',
    name: 'Deep Forest & Mint',
    description: 'Organic tech feel with deep evergreen and fresh spring mint',
    primary: '#064E3B',
    accent: '#10B981',
    bg: '#ffffff',
    text: '#064E3B',
    surface: '#f0fdf4',
  },
  {
    id: 'royal-purple',
    name: 'Royal Violet & Rose',
    description: 'Distinctive creative look with rich purple and bold rose gold',
    primary: '#3B0764',
    accent: '#F43F5E',
    bg: '#ffffff',
    text: '#3B0764',
    surface: '#faf5ff',
  },
  {
    id: 'ocean-azure',
    name: 'Deep Ocean & Azure',
    description: 'Clean architectural palette with navy blue and bright sky azure',
    primary: '#0C4A6E',
    accent: '#0284C7',
    bg: '#ffffff',
    text: '#0C4A6E',
    surface: '#f0f9ff',
  },
  {
    id: 'dark-obsidian',
    name: 'Dark Obsidian & Neon Teal',
    description: 'High-contrast dark mode with obsidian background and electric teal highlights',
    primary: '#38BDF8',
    accent: '#2DD4BF',
    bg: '#0B0F19',
    text: '#F1F5F9',
    surface: '#111827',
  },
];

const FONT_OPTIONS = [
  { name: 'Inter', category: 'Sans-Serif', note: 'Modern, balanced, highly readable on all screens' },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif', note: 'Clean geometric European sans with crisp curves' },
  { name: 'Outfit', category: 'Sans-Serif', note: 'Punchy, contemporary tech vibe' },
  { name: 'Poppins', category: 'Sans-Serif', note: 'Geometric curves with friendly personality' },
  { name: 'Roboto', category: 'Sans-Serif', note: 'Classic Google material design typography' },
  { name: 'Space Grotesk', category: 'Sans-Serif', note: 'Distinctive engineering aesthetic' },
  { name: 'Fira Code', category: 'Monospace', note: 'Iconic developer font with coding ligatures' },
  { name: 'JetBrains Mono', category: 'Monospace', note: 'Developer-oriented clean monospace' },
  { name: 'System', category: 'System UI', note: 'Native OS font (San Francisco / Segoe UI)' },
];

function hexToRgba(hexColor: string, alpha: number): string {
  if (!hexColor || typeof hexColor !== 'string') return `rgba(15, 154, 115, ${alpha})`;
  let clean = hexColor.trim().replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return `rgba(15, 154, 115, ${alpha})`;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(15, 154, 115, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getContrastColor(hexColor: string): string {
  if (!hexColor || typeof hexColor !== 'string') return '#ffffff';
  let clean = hexColor.trim().replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return '#ffffff';
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#ffffff';
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#0B1F3A' : '#ffffff';
}

export default function AdminSettingsPage() {
  const {
    settingsMap,
    updateSettingsBatch,
    resetToDefaults,
    setPreviewStyle,
    clearPreview,
    isLoading: settingsLoading,
    isSaving,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<TabKey>('theme');
  const [formData, setFormData] = useState<Record<string, string>>({ ...settingsMap });
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync formData when initial settings load or refresh
  useEffect(() => {
    if (!hasChanges) {
      setFormData(settingsMap);
    }
  }, [settingsMap, hasChanges]);

  // Load statistics from API
  useEffect(() => {
    api
      .getStatistics()
      .then((res) => {
        if (Array.isArray(res)) setStatistics(res);
      })
      .catch((err) => console.error('Failed to load statistics', err))
      .finally(() => setLoadingStats(false));
  }, []);

  // Update a single form field and trigger live style preview
  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
    setHasChanges(true);

    // If changing a theme/color/font property, apply live to DOM immediately
    if (['primaryColor', 'accentColor', 'backgroundColor', 'textColor', 'surfaceColor', 'fontFamily'].includes(key)) {
      setPreviewStyle(key, value);
    }
  };

  // Apply a preset palette
  const handleApplyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    setFormData((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      backgroundColor: preset.bg,
      textColor: preset.text,
      surfaceColor: preset.surface,
    }));
    setHasChanges(true);

    setPreviewStyle('primaryColor', preset.primary);
    setPreviewStyle('accentColor', preset.accent);
    setPreviewStyle('backgroundColor', preset.bg);
    setPreviewStyle('textColor', preset.text);
    setPreviewStyle('surfaceColor', preset.surface);

    toast.info(`Applied "${preset.name}" preset preview!`);
  };

  // Save all settings to backend
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await updateSettingsBatch(formData);
      setHasChanges(false);
      toast.success('Website configuration & styles saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    }
  };

  // Discard changes
  const handleDiscardChanges = () => {
    setFormData({ ...settingsMap });
    clearPreview();
    setHasChanges(false);
    toast.info('Discarded unsaved changes');
  };

  // Reset to original factory defaults
  const handleResetToDefaults = async () => {
    if (!window.confirm('Reset all website settings and styles to factory defaults?')) {
      return;
    }
    try {
      await resetToDefaults();
      setFormData(DEFAULT_SETTINGS);
      setHasChanges(false);
      toast.success('Reset all settings to default branding!');
    } catch {
      toast.error('Failed to reset settings');
    }
  };

  // Statistic handlers
  const handleUpdateStat = async (stat: Statistic) => {
    try {
      await api.updateStatistic(stat.id, stat);
      toast.success(`Statistic '${stat.label}' updated`);
    } catch {
      toast.error('Failed to update statistic');
    }
  };

  const handleDeleteStat = async (id: string) => {
    try {
      await api.deleteStatistic(id);
      setStatistics((prev) => prev.filter((s) => s.id !== id));
      toast.success('Statistic removed');
    } catch {
      toast.error('Failed to delete statistic');
    }
  };

  const handleAddStat = async () => {
    try {
      const created = await api.createStatistic({
        label: 'New Metric',
        value: '10+',
        icon: 'Code',
        displayOrder: statistics.length + 1,
      });
      setStatistics([...statistics, created]);
      toast.success('New statistic added');
    } catch {
      toast.error('Failed to add statistic');
    }
  };

  // Quick values for live preview card
  const primaryColor = formData.primaryColor || '#00007B';
  const accentColor = formData.accentColor || '#0F9A73';
  const bgColor = formData.backgroundColor || '#ffffff';
  const textColor = formData.textColor || '#00007B';
  const surfaceColor = formData.surfaceColor || '#f8fafd';
  const currentFont = formData.fontFamily || 'Inter';

  const brandName = formData.brandName || 'Alex Morgan';
  const brandRole = formData.brandRole || 'Senior Full-Stack Architect';
  const heroHeadline = formData.heroHeadline || 'Alex Morgan';
  const heroTitle = formData.heroTitle || 'Senior Full-Stack Engineer & Cloud Architect';
  const heroBio =
    formData.heroBio ||
    'Architecting resilient distributed backends, high-performance Next.js web applications, and fault-tolerant cloud systems that scale to millions of requests.';
  const availability = formData.availabilityStatus || 'Available for hire';
  const tagline = formData.heroTagline || 'main branch • 8+ years shipping code';
  const ctaPrimary = formData.heroCtaPrimary || 'Explore Case Studies';
  const ctaSecondary = formData.heroCtaSecondary || 'Download CV';

  if (settingsLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-10 h-10 border-3 border-[#0F9A73] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs font-mono text-[#00007B]/70">Loading website configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header & Global Action Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#00007B]/10 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Global Theme &amp; CMS Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00007B] tracking-tight">
            Website Configuration &amp; Design
          </h1>
          <p className="text-xs sm:text-sm text-[#00007B]/70 mt-1 max-w-2xl leading-relaxed">
            Customize typography, brand colors, homepage text, navbar identity, footer legal notes, and real-time statistics. Changes reflect immediately across the entire website.
          </p>
        </div>

        {/* Global Save / Discard Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {hasChanges && (
            <button
              onClick={handleDiscardChanges}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#00007B] bg-[#f8fafd] hover:bg-[#00007B]/5 border border-[#00007B]/15 transition-all shadow-sm"
              title="Discard unsaved changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm"
            title="Reset to default brand settings"
          >
            <span>Reset Defaults</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#00007B] bg-white hover:bg-[#f8fafd] border border-[#00007B]/15 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#0F9A73]" />
            <span>Live Site</span>
          </a>

          <Button
            type="button"
            onClick={() => handleSaveAll()}
            variant="primary"
            size="md"
            isLoading={isSaving}
            className={`shadow-md font-bold ${
              hasChanges ? 'ring-2 ring-[#0F9A73] ring-offset-2 animate-pulse' : ''
            }`}
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{hasChanges ? 'Save Changes' : 'Saved'}</span>
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="font-semibold">
              Live preview is active! Your changes are previewed live on the screen. Click &quot;Save Changes&quot; to apply permanently.
            </span>
          </div>
          <button
            onClick={() => handleSaveAll()}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-sm"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Main Grid: Form Left, Sticky Live Preview Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Navigation Tabs & Settings Panels */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Tab Navigation Ribbon */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white rounded-2xl border border-[#00007B]/10 shadow-sm [scrollbar-width:none]">
            {[
              { id: 'theme', label: 'Theme & Colors', icon: Palette },
              { id: 'typography', label: 'Typography', icon: Type },
              { id: 'identity', label: 'Brand & Identity', icon: User },
              { id: 'hero', label: 'Hero Texts', icon: Layout },
              { id: 'footer', label: 'Footer & Legal', icon: FileText },
              { id: 'stats', label: 'Dynamic Stats', icon: Layers },
              { id: 'seo', label: 'SEO & Meta', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#00007B] text-white shadow-sm font-bold'
                      : 'text-[#00007B]/70 hover:text-[#00007B] hover:bg-[#f8fafd]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0F9A73]' : 'text-[#00007B]/50'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: THEME & BRAND COLORS */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              {/* Preset Palettes Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#00007B]/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#00007B] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0F9A73]" />
                      Curated Designer Color Palettes
                    </h3>
                    <p className="text-xs text-[#00007B]/60 mt-0.5">
                      Select a professionally calibrated color theme to instantly restyle the entire website.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected =
                      formData.primaryColor === preset.primary && formData.accentColor === preset.accent;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 group relative ${
                          isSelected
                            ? 'border-[#0F9A73] bg-[#0F9A73]/5 shadow-sm ring-2 ring-[#0F9A73]/20'
                            : 'border-[#00007B]/10 bg-[#f8fafd] hover:border-[#00007B]/25 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-[#00007B] group-hover:text-[#0F9A73] transition-colors">
                            {preset.name}
                          </span>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#0F9A73] bg-white px-2 py-0.5 rounded-full border border-[#0F9A73]/30">
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>

                        {/* Swatch Previews */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-6 h-6 rounded-lg shadow-sm border border-black/10 inline-block"
                            style={{ backgroundColor: preset.primary }}
                            title={`Primary: ${preset.primary}`}
                          />
                          <span
                            className="w-6 h-6 rounded-lg shadow-sm border border-black/10 inline-block"
                            style={{ backgroundColor: preset.accent }}
                            title={`Accent: ${preset.accent}`}
                          />
                          <span
                            className="w-6 h-6 rounded-lg shadow-sm border border-black/10 inline-block"
                            style={{ backgroundColor: preset.bg }}
                            title={`Background: ${preset.bg}`}
                          />
                          <span
                            className="w-6 h-6 rounded-lg shadow-sm border border-black/10 inline-block"
                            style={{ backgroundColor: preset.surface }}
                            title={`Surface: ${preset.surface}`}
                          />
                          <span className="text-[10px] font-mono text-[#00007B]/50 ml-1 truncate">
                            {preset.primary} • {preset.accent}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#00007B]/10 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#00007B] flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#0F9A73]" />
                    Custom Color Palette Controls
                  </h3>
                  <p className="text-xs text-[#00007B]/60 mt-0.5">
                    Click the color box or enter any valid Hex color code. Changes reflect live on the website.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Primary Color */}
                  <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#00007B] font-mono">
                        Primary Brand Color
                      </label>
                      <span className="text-[10px] text-[#00007B]/50 font-mono">--primary-color</span>
                    </div>
                    <p className="text-[11px] text-[#00007B]/60">
                      Applied to brand logos, section headings, and primary visual anchors.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-[#00007B]/20 bg-transparent p-0.5"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.primaryColor || '#00007B'}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#00007B]/15 text-xs font-mono font-bold text-[#00007B] uppercase focus:outline-none focus:ring-2 focus:ring-[#0F9A73]"
                        placeholder="#00007B"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#00007B] font-mono">
                        Accent &amp; CTA Color
                      </label>
                      <span className="text-[10px] text-[#00007B]/50 font-mono">--accent-color</span>
                    </div>
                    <p className="text-[11px] text-[#00007B]/60">
                      Applied to primary action buttons, links, icons, and live pulses.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-[#00007B]/20 bg-transparent p-0.5"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.accentColor || '#0F9A73'}
                        onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#00007B]/15 text-xs font-mono font-bold text-[#00007B] uppercase focus:outline-none focus:ring-2 focus:ring-[#0F9A73]"
                        placeholder="#0F9A73"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#00007B] font-mono">
                        Main Canvas Background
                      </label>
                      <span className="text-[10px] text-[#00007B]/50 font-mono">--background</span>
                    </div>
                    <p className="text-[11px] text-[#00007B]/60">
                      The core background color of the entire website body and pages.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => handleFieldChange('backgroundColor', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-[#00007B]/20 bg-transparent p-0.5"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.backgroundColor || '#ffffff'}
                        onChange={(e) => handleFieldChange('backgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#00007B]/15 text-xs font-mono font-bold text-[#00007B] uppercase focus:outline-none focus:ring-2 focus:ring-[#0F9A73]"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Text / Foreground Color */}
                  <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#00007B] font-mono">
                        Typography &amp; Text Color
                      </label>
                      <span className="text-[10px] text-[#00007B]/50 font-mono">--foreground</span>
                    </div>
                    <p className="text-[11px] text-[#00007B]/60">
                      Standard color for headings, titles, descriptions, and paragraphs.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => handleFieldChange('textColor', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-[#00007B]/20 bg-transparent p-0.5"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.textColor || '#00007B'}
                        onChange={(e) => handleFieldChange('textColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#00007B]/15 text-xs font-mono font-bold text-[#00007B] uppercase focus:outline-none focus:ring-2 focus:ring-[#0F9A73]"
                        placeholder="#00007B"
                      />
                    </div>
                  </div>

                  {/* Card / Surface Tint Color */}
                  <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#00007B] font-mono">
                        Surface / Subtle Card Background
                      </label>
                      <span className="text-[10px] text-[#00007B]/50 font-mono">--surface-color</span>
                    </div>
                    <p className="text-[11px] text-[#00007B]/60">
                      Color used for secondary pills, navigation capsules, code blocks, and subtle footer container cards.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative">
                        <input
                          type="color"
                          value={surfaceColor}
                          onChange={(e) => handleFieldChange('surfaceColor', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-[#00007B]/20 bg-transparent p-0.5"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.surfaceColor || '#f8fafd'}
                        onChange={(e) => handleFieldChange('surfaceColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#00007B]/15 text-xs font-mono font-bold text-[#00007B] uppercase focus:outline-none focus:ring-2 focus:ring-[#0F9A73]"
                        placeholder="#f8fafd"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY & FONTS */}
          {activeTab === 'typography' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#00007B]/10 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#00007B] flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#0F9A73]" />
                  Global Website Typography Engine
                </h3>
                <p className="text-xs text-[#00007B]/60 mt-0.5">
                  Select a font family from Google Fonts or system defaults. The selected font is loaded dynamically and applied across all pages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FONT_OPTIONS.map((f) => {
                  const isSelected = (formData.fontFamily || 'Inter') === f.name;
                  return (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => handleFieldChange('fontFamily', f.name)}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 ${
                        isSelected
                          ? 'border-[#0F9A73] bg-[#0F9A73]/5 ring-2 ring-[#0F9A73]/20 shadow-sm'
                          : 'border-[#00007B]/10 bg-[#f8fafd] hover:border-[#00007B]/25 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#00007B]">{f.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#00007B]/60 border border-[#00007B]/10">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#00007B]/60 leading-relaxed">{f.note}</p>
                      <div className="pt-2 text-xs text-[#00007B] font-medium" style={{ fontFamily: f.name }}>
                        The quick brown fox jumps over the lazy dog.
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BRAND & IDENTITY */}
          {activeTab === 'identity' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#00007B]/10 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#00007B] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0F9A73]" />
                  Brand Identity &amp; Contact Coordinates
                </h3>
                <p className="text-xs text-[#00007B]/60 mt-0.5">
                  These texts populate the header logo, status badges, official email, and location.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Website Title (Browser Tab &amp; OpenGraph)
                  </label>
                  <input
                    type="text"
                    value={formData.siteName || ''}
                    onChange={(e) => handleFieldChange('siteName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="Alex Morgan | Senior Full-Stack Engineer"
                  />
                  <span className="text-[11px] text-[#00007B]/50 mt-1 block">
                    Shown in the browser tab and search results.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Brand Name (Navbar &amp; Footer Logo)
                    </label>
                    <input
                      type="text"
                      value={formData.brandName || ''}
                      onChange={(e) => handleFieldChange('brandName', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="Alex Morgan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Brand Subtitle / Role
                    </label>
                    <input
                      type="text"
                      value={formData.brandRole || ''}
                      onChange={(e) => handleFieldChange('brandRole', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="Senior Full-Stack Architect"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Availability Status Badge Text
                    </label>
                    <input
                      type="text"
                      value={formData.availabilityStatus || ''}
                      onChange={(e) => handleFieldChange('availabilityStatus', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="Available for hire"
                    />
                    <span className="text-[11px] text-[#00007B]/50 mt-1 block">
                      Shown with glowing pulsing dot in the Hero section.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Location &amp; Work Mode
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="San Francisco, CA (Open to Worldwide Remote)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="alex@alexmorgan.dev"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Official Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhone || ''}
                      onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="+1 (415) 890-4211"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HERO & HOMEPAGE TEXTS */}
          {activeTab === 'hero' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#00007B]/10 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#00007B] flex items-center gap-2">
                  <Layout className="w-4 h-4 text-[#0F9A73]" />
                  Hero Section Text &amp; CTAs
                </h3>
                <p className="text-xs text-[#00007B]/60 mt-0.5">
                  Control the main hero narrative headlines, summary bio, branch badge, and button labels.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Hero Main Headline (Name / Title)
                  </label>
                  <input
                    type="text"
                    value={formData.heroHeadline || ''}
                    onChange={(e) => handleFieldChange('heroHeadline', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="Alex Morgan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Hero Subtitle &amp; Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle || ''}
                    onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="Senior Full-Stack Engineer & Cloud Architect"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Hero Branch / Tagline Pill
                  </label>
                  <input
                    type="text"
                    value={formData.heroTagline || ''}
                    onChange={(e) => handleFieldChange('heroTagline', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="main branch • 8+ years shipping code"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Senior Narrative Bio (Hero Paragraph)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.heroBio || ''}
                    onChange={(e) => handleFieldChange('heroBio', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white leading-relaxed"
                    placeholder="Architecting resilient distributed backends, high-performance Next.js web applications, and fault-tolerant cloud systems that scale to millions of requests."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Button 1 (Primary CTA)
                    </label>
                    <input
                      type="text"
                      value={formData.heroCtaPrimary || ''}
                      onChange={(e) => handleFieldChange('heroCtaPrimary', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-xs text-[#00007B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="Explore Case Studies"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Button 2 (Resume / CV)
                    </label>
                    <input
                      type="text"
                      value={formData.heroCtaSecondary || ''}
                      onChange={(e) => handleFieldChange('heroCtaSecondary', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-xs text-[#00007B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="Download CV"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Button 3 (Contact)
                    </label>
                    <input
                      type="text"
                      value={formData.heroCtaContact || ''}
                      onChange={(e) => handleFieldChange('heroCtaContact', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-xs text-[#00007B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                      placeholder="Contact"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FOOTER & LEGAL TEXTS */}
          {activeTab === 'footer' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#00007B]/10 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#00007B] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0F9A73]" />
                  Footer &amp; Legal Content
                </h3>
                <p className="text-xs text-[#00007B]/60 mt-0.5">
                  Manage the footer bio note, copyright label, and status indicator.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Footer Bio Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formData.footerBio || ''}
                    onChange={(e) => handleFieldChange('footerBio', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="Staff Full-Stack Software Engineer & Cloud Systems Architect. Crafting deterministic, fault-tolerant web applications and high-throughput microservices."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Footer Status Indicator Text
                  </label>
                  <input
                    type="text"
                    value={formData.footerStatusText || ''}
                    onChange={(e) => handleFieldChange('footerStatusText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="All services online"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Footer Copyright Line
                  </label>
                  <input
                    type="text"
                    value={formData.footerCopyright || ''}
                    onChange={(e) => handleFieldChange('footerCopyright', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="© 2026 Alex Morgan. Built with Next.js, Node.js & PostgreSQL."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DYNAMIC STATISTICS */}
          {activeTab === 'stats' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#00007B]/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#00007B] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0F9A73]" />
                    Homepage Dynamic Counters &amp; Metrics
                  </h3>
                  <p className="text-xs text-[#00007B]/60 mt-0.5">
                    These key metrics appear prominently in the statistics counter band on the homepage.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleAddStat}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add Metric</span>
                </Button>
              </div>

              {loadingStats ? (
                <div className="py-8 text-center text-xs font-mono text-[#00007B]/60">
                  Loading statistics counters...
                </div>
              ) : statistics.length === 0 ? (
                <div className="py-8 text-center bg-[#f8fafd] rounded-2xl border border-dashed border-[#00007B]/20">
                  <p className="text-xs text-[#00007B]/70 mb-2">No dynamic metrics configured yet.</p>
                  <Button variant="primary" size="sm" onClick={handleAddStat}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Create First Metric</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {statistics.map((stat, idx) => (
                    <div
                      key={stat.id}
                      className="p-3.5 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 flex flex-col sm:flex-row items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="w-6 h-6 rounded-lg bg-white border border-[#00007B]/10 text-[10px] font-mono font-bold text-[#00007B]/60 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStatistics((prev) =>
                              prev.map((s) => (s.id === stat.id ? { ...s, value: val } : s))
                            );
                          }}
                          className="w-24 px-3 py-1.5 rounded-xl bg-white border border-[#00007B]/15 text-sm font-bold font-mono text-[#0F9A73] focus:outline-none"
                          placeholder="e.g. 8+"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStatistics((prev) =>
                              prev.map((s) => (s.id === stat.id ? { ...s, label: val } : s))
                            );
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#00007B]/15 text-xs text-[#00007B] font-medium focus:outline-none"
                          placeholder="Metric label"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleUpdateStat(stat)}
                          className="p-2 rounded-xl text-xs font-semibold text-[#00007B] bg-white hover:bg-[#00007B]/5 border border-[#00007B]/15 transition-all"
                          title="Save this stat"
                        >
                          <Save className="w-3.5 h-3.5 text-[#0F9A73]" />
                        </button>
                        <button
                          onClick={() => handleDeleteStat(stat.id)}
                          className="p-2 rounded-xl text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 transition-all"
                          title="Delete metric"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SEO & ADVANCED */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#00007B]/10 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#00007B] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0F9A73]" />
                  Search Engine Optimization &amp; Analytics
                </h3>
                <p className="text-xs text-[#00007B]/60 mt-0.5">
                  Metadata configured here injects directly into search engines and social link previews.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Meta Description (SEO &amp; Snippets)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.seoMetaDescription || ''}
                    onChange={(e) => handleFieldChange('seoMetaDescription', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white leading-relaxed"
                    placeholder="Production portfolio of Alex Morgan. Specializing in Next.js 15, TypeScript, Node.js, PostgreSQL, Docker, and distributed systems architecture."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Search Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.seoKeywords || ''}
                    onChange={(e) => handleFieldChange('seoKeywords', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="Full-Stack Developer, Software Architect, Next.js, TypeScript, PostgreSQL"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Google Analytics 4 Measurement ID
                  </label>
                  <input
                    type="text"
                    value={formData.googleAnalyticsId || ''}
                    onChange={(e) => handleFieldChange('googleAnalyticsId', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 text-sm text-[#00007B] font-mono focus:outline-none focus:ring-2 focus:ring-[#0F9A73] focus:bg-white"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#00007B]">Maintenance Mode</span>
                    <span className="text-[11px] text-[#00007B]/60">
                      When enabled, only administrators can access portfolio pages.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.maintenanceMode === 'true'}
                      onChange={(e) =>
                        handleFieldChange('maintenanceMode', e.target.checked ? 'true' : 'false')
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F9A73]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer for the Form */}
          <div className="bg-white rounded-2xl p-4 border border-[#00007B]/10 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#00007B]/60">
              <CheckCircle2 className="w-4 h-4 text-[#0F9A73]" />
              <span>Theme changes update live CSS variables in real time</span>
            </div>

            <Button
              type="button"
              onClick={() => handleSaveAll()}
              variant="primary"
              size="md"
              isLoading={isSaving}
              className="font-bold shadow-md"
            >
              <Save className="w-4 h-4 mr-1.5" />
              <span>Save Website Settings</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Sticky Live Interactive Mockup Canvas */}
        <div className="xl:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#00007B]/10 shadow-lg space-y-4">
            
            {/* Mockup Header */}
            <div className="flex items-center justify-between border-b border-[#00007B]/10 pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#0F9A73]" />
                <span className="text-xs font-bold text-[#00007B] tracking-tight">
                  Real-Time Website Preview
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F9A73]/15 text-[#0F9A73] font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9A73] animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* Browser Mockup Window */}
            <div
              className="rounded-2xl border shadow-sm overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: bgColor,
                borderColor: `${primaryColor}20`,
                color: textColor,
                fontFamily: currentFont,
              }}
            >
              {/* Browser Address Bar */}
              <div
                className="px-3 py-2 border-b flex items-center justify-between text-[10px] font-mono"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: `${primaryColor}15`,
                  color: textColor,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div
                  className="px-2.5 py-0.5 rounded-md bg-white/70 border text-center truncate max-w-[180px]"
                  style={{ borderColor: `${primaryColor}20`, color: textColor }}
                >
                  alexmorgan.dev
                </div>
                <span className="text-[10px] text-[#0F9A73] font-bold">HTTPS</span>
              </div>

              {/* Mini Navbar Preview */}
              <div
                className="px-4 py-2.5 border-b flex items-center justify-between backdrop-blur-sm"
                style={{
                  backgroundColor: hexToRgba(bgColor, 0.95),
                  borderColor: hexToRgba(primaryColor, 0.15),
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Terminal className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <span
                      className="text-xs font-bold block leading-none"
                      style={{ color: primaryColor }}
                    >
                      {brandName}
                    </span>
                    <span
                      className="text-[8px] font-mono block uppercase tracking-wider font-bold"
                      style={{ color: accentColor }}
                    >
                      {brandRole}
                    </span>
                  </div>
                </div>

                <div
                  className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border"
                  style={{
                    backgroundColor: hexToRgba(accentColor, 0.15),
                    color: accentColor,
                    borderColor: hexToRgba(accentColor, 0.35),
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span>{availability}</span>
                </div>
              </div>

              {/* Mini Hero Section Preview */}
              <div className="p-5 space-y-3.5">
                {/* Tagline */}
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border"
                  style={{
                    backgroundColor: hexToRgba(accentColor, 0.15),
                    color: accentColor,
                    borderColor: hexToRgba(accentColor, 0.35),
                  }}
                >
                  <span>{tagline}</span>
                </div>

                {/* Hero Title */}
                <div>
                  <h2
                    className="text-lg font-extrabold tracking-tight leading-tight"
                    style={{ color: primaryColor }}
                  >
                    {heroHeadline}
                  </h2>
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: hexToRgba(primaryColor, 0.85) }}
                  >
                    {heroTitle}
                  </p>
                </div>

                {/* Hero Bio */}
                <p
                  className="text-[11px] leading-relaxed line-clamp-3"
                  style={{ color: hexToRgba(textColor, 0.85) }}
                >
                  {heroBio}
                </p>

                {/* Action Buttons Mockup */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm cursor-default"
                    style={{
                      backgroundColor: accentColor,
                      color: getContrastColor(accentColor),
                    }}
                  >
                    <span>{ctaPrimary}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold border cursor-default"
                    style={{
                      borderColor: hexToRgba(primaryColor, 0.25),
                      color: primaryColor,
                      backgroundColor: surfaceColor,
                    }}
                  >
                    <Download className="w-2.5 h-2.5" style={{ color: accentColor }} />
                    <span>{ctaSecondary}</span>
                  </span>
                </div>
              </div>

              {/* Active Palette Chips */}
              <div
                className="p-3 border-t grid grid-cols-5 gap-1.5 text-center text-[9px] font-mono"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: `${primaryColor}15`,
                }}
              >
                <div>
                  <span
                    className="w-full h-4 rounded block mb-1 shadow-xs border border-black/10"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span className="block truncate text-[8px]" style={{ color: textColor }}>
                    Primary
                  </span>
                </div>
                <div>
                  <span
                    className="w-full h-4 rounded block mb-1 shadow-xs border border-black/10"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="block truncate text-[8px]" style={{ color: textColor }}>
                    Accent
                  </span>
                </div>
                <div>
                  <span
                    className="w-full h-4 rounded block mb-1 shadow-xs border border-black/10"
                    style={{ backgroundColor: bgColor }}
                  />
                  <span className="block truncate text-[8px]" style={{ color: textColor }}>
                    Canvas
                  </span>
                </div>
                <div>
                  <span
                    className="w-full h-4 rounded block mb-1 shadow-xs border border-black/10"
                    style={{ backgroundColor: textColor }}
                  />
                  <span className="block truncate text-[8px]" style={{ color: textColor }}>
                    Text
                  </span>
                </div>
                <div>
                  <span
                    className="w-full h-4 rounded block mb-1 shadow-xs border border-black/10"
                    style={{ backgroundColor: surfaceColor }}
                  />
                  <span className="block truncate text-[8px]" style={{ color: textColor }}>
                    Surface
                  </span>
                </div>
              </div>
            </div>

            {/* Typography Callout */}
            <div className="p-3 rounded-2xl bg-[#f8fafd] border border-[#00007B]/10 flex items-center justify-between text-xs">
              <span className="text-[#00007B]/70">Active Font Family:</span>
              <span className="font-bold text-[#00007B] font-mono px-2 py-0.5 rounded-md bg-white border border-[#00007B]/10">
                {currentFont}
              </span>
            </div>

            <p className="text-[11px] text-center text-[#00007B]/50 leading-relaxed">
              Every detail in this preview uses the exact live variables synchronized with the public portfolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
