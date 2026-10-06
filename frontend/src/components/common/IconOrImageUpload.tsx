'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Search,
  Check,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { TechIcon, TECH_LIBRARY } from './TechIcon';
import { api } from '../../lib/api';
import { toast } from 'sonner';

interface IconOrImageUploadProps {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  helperText?: string;
  mode?: 'all' | 'icon' | 'image';
  placeholder?: string;
}

export const IconOrImageUpload: React.FC<IconOrImageUploadProps> = ({
  label,
  value = '',
  onChange,
  helperText,
  mode = 'all',
  placeholder = 'Select an icon or upload an image',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>(
    mode === 'image' ? 'upload' : 'library'
  );
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories for the tech icon library
  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps / Cloud', 'Platform / Social'];

  const filteredIcons = TECH_LIBRARY.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.uploadFile(file);
      onChange(res.url);
      setUrlInput(res.url);
      toast.success('Asset uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    onChange(urlInput.trim());
    toast.success('URL applied');
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-2.5">
      {/* Label and Current Status */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono font-medium text-[#00007B]">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Current Preview Banner */}
      <div className="flex items-center gap-3 p-3 bg-white border border-[#00007B]/15 rounded-xl shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
          {value ? (
            <TechIcon name={value} size={32} />
          ) : (
            <ImageIcon className="w-6 h-6 text-[#00007B]/30" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-[#00007B] truncate">
            {value ? (
              <span className="font-mono text-[#00007B]">{value}</span>
            ) : (
              <span className="text-[#00007B]/40 italic">{placeholder}</span>
            )}
          </div>
          <div className="text-[11px] text-[#00007B]/60 truncate mt-0.5">
            {value
              ? value.startsWith('http') || value.startsWith('/uploads')
                ? 'Custom image / web asset linked'
                : 'Selected tech tool badge icon'
              : helperText || 'Choose from library, upload a file, or paste a link'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#f8fafd] p-1 rounded-xl border border-[#00007B]/15 flex gap-1">
        {mode !== 'image' && (
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-white text-[#00007B] font-bold shadow-sm border border-[#00007B]/10'
                : 'text-[#00007B]/70 hover:text-[#00007B]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F9A73]" />
            <span>Tech Tool Library</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-white text-[#00007B] font-bold shadow-sm border border-[#00007B]/10'
              : 'text-[#00007B]/70 hover:text-[#00007B]'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#0F9A73]" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-white text-[#00007B] font-bold shadow-sm border border-[#00007B]/10'
              : 'text-[#00007B]/70 hover:text-[#00007B]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-[#0F9A73]" />
          <span>Image / Icon URL</span>
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. Tech Library Tab */}
      {activeTab === 'library' && (
        <div className="bg-white border border-[#00007B]/15 rounded-xl p-3 space-y-3 shadow-sm">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#00007B]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools (e.g. React, PostgreSQL, Docker)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8fafd] border border-[#00007B]/20 rounded-lg text-[#00007B] placeholder:text-[#00007B]/40 focus:outline-none focus:border-[#0F9A73]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 text-[11px] rounded font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#00007B] text-white'
                      : 'bg-[#f8fafd] border border-[#00007B]/15 text-[#00007B]/70 hover:text-[#00007B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Tech Badges */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-[#00007B]/10 rounded-lg bg-[#f8fafd]/50">
            {filteredIcons.map((tool) => {
              const isSelected = value?.toLowerCase() === tool.id.toLowerCase();
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    onChange(tool.id);
                    setUrlInput(tool.id);
                  }}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all ${
                    isSelected
                      ? 'bg-[#0F9A73]/15 border-2 border-[#0F9A73] shadow-sm'
                      : 'bg-white border border-[#00007B]/10 hover:border-[#00007B]/30 hover:shadow-sm'
                  }`}
                >
                  <TechIcon name={tool.id} size={24} />
                  <span className="text-[11px] font-semibold text-[#00007B] truncate w-full">
                    {tool.name}
                  </span>
                  {isSelected && (
                    <span className="w-3.5 h-3.5 bg-[#0F9A73] text-white rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
            {filteredIcons.length === 0 && (
              <div className="col-span-full py-6 text-center text-xs text-[#00007B]/60">
                No matching tech tools found in library. Try the Upload or URL tab.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Upload File Tab */}
      {activeTab === 'upload' && (
        <div className="bg-white border border-[#00007B]/15 rounded-xl p-4 text-center space-y-3 shadow-sm">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/x-icon"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#00007B]/20 hover:border-[#0F9A73] bg-[#f8fafd] rounded-xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center group"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-[#0F9A73]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-mono font-bold">Uploading file to server...</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#00007B]/15 flex items-center justify-center text-[#0F9A73] group-hover:scale-110 group-hover:border-[#0F9A73] transition-all shadow-sm mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-[#00007B]">
                  Click to browse or drop an icon/image
                </div>
                <div className="text-[11px] text-[#00007B]/60 mt-1 font-mono">
                  PNG, JPG, SVG, WebP, GIF up to 10MB
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. Direct URL Tab */}
      {activeTab === 'url' && (
        <div className="bg-white border border-[#00007B]/15 rounded-xl p-3 space-y-3 shadow-sm">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://... or /uploads/..."
              className="flex-1 px-3 py-2 text-xs bg-[#f8fafd] border border-[#00007B]/20 rounded-xl text-[#00007B] font-mono focus:outline-none focus:border-[#0F9A73]"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-[#0F9A73] text-white text-xs font-bold rounded-xl hover:bg-[#12b88a] transition-all"
            >
              Apply
            </button>
          </div>
          <div className="text-[11px] text-[#00007B]/60 font-mono">
            Direct web URL, Unsplash photo, or custom SVG link.
          </div>
        </div>
      )}
    </div>
  );
};
