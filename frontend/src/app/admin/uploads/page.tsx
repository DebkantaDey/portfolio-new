'use client';

import React, { useState } from 'react';
import { Upload, Copy, Check, FileText, Image as ImageIcon, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../lib/api';
import { toast } from 'sonner';

export default function AdminUploadsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.uploadFile(selectedFile);
      setUploadedUrl(res.url);
      toast.success('File uploaded successfully!');
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Copied URL to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 w-full lg:w-[80%] lg:max-w-none">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">File & Resume Uploads</h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF resumes, screenshots, or profile avatars. Copied URLs can be pasted directly into project or profile forms.
        </p>
      </div>

      {/* Upload Drop Zone Card */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-8 space-y-6">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-navy-700 hover:border-cyan/50 rounded-2xl p-8 text-center transition-colors">
            <Upload className="w-10 h-10 text-cyan mx-auto mb-3" />
            <p className="text-sm font-semibold text-white mb-1">
              Select or drop an image or PDF resume
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Supported formats: JPEG, PNG, WebP, SVG, PDF (Max size: 10MB)
            </p>

            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />
            <label htmlFor="file-upload">
              <Button type="button" variant="secondary" size="sm" className="cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                Choose File from Computer
              </Button>
            </label>

            {selectedFile && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-950 border border-cyan/30 text-cyan text-xs font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!selectedFile}
              isLoading={isUploading}
              className="shadow-glow"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span>Upload to Server</span>
            </Button>
          </div>
        </form>

        {uploadedUrl && (
          <div className="p-4 rounded-xl bg-cyan/10 border border-cyan/30 space-y-2">
            <span className="text-xs font-semibold text-cyan">Upload Complete! File URL:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={uploadedUrl}
                className="flex-1 px-3 py-2 rounded-lg bg-navy-950 border border-navy-800 text-white font-mono text-xs focus:outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => copyToClipboard(uploadedUrl)}
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
