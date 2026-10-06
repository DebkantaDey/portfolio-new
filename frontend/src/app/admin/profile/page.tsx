'use client';

import React, { useEffect, useState } from 'react';
import { Save, User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { IconOrImageUpload } from '../../../components/common/IconOrImageUpload';
import { api } from '../../../lib/api';
import { Profile } from '../../../types';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getProfile()
      .then((data) => {
        setProfile(data || {});
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (field: keyof Profile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      toast.success('Profile details saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#0F9A73] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full lg:w-[80%] lg:max-w-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#00007B] tracking-tight">Profile &amp; Bio Management</h2>
          <p className="text-xs text-[#00007B]/70 mt-1">
            Manage public bio, titles, profile photo, contact details, and career availability.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#00007B]/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Core Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={profile.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Professional Title *
            </label>
            <input
              type="text"
              required
              value={profile.professionalTitle || ''}
              onChange={(e) => handleChange('professionalTitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>
        </div>

        {/* Short Bio */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
            Hero Short Bio (appears in Homepage Hero) *
          </label>
          <textarea
            required
            rows={2}
            value={profile.shortBio || ''}
            onChange={(e) => handleChange('shortBio', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none"
          />
        </div>

        {/* Long Bio */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
            Full Narrative Bio (About Page) *
          </label>
          <textarea
            required
            rows={5}
            value={profile.longBio || ''}
            onChange={(e) => handleChange('longBio', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73] resize-none leading-relaxed"
          />
        </div>

        {/* Experience & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Availability Status *
            </label>
            <select
              value={profile.availabilityStatus || 'Available for full-time & high-impact contracts'}
              onChange={(e) => handleChange('availabilityStatus', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            >
              <option value="Available for full-time & high-impact contracts">
                Available for full-time &amp; contracts
              </option>
              <option value="Open to Senior / Staff Engineering Roles">
                Open to Senior / Staff Roles
              </option>
              <option value="Currently Employed / Open for Advisory">
                Currently Employed / Advisory
              </option>
              <option value="Not Currently Available">Not Currently Available</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Years of Experience (Numeric) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={profile.yearsOfExperience || 0}
              onChange={(e) => handleChange('yearsOfExperience', parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={profile.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Location / Timezone *
            </label>
            <input
              type="text"
              required
              value={profile.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="San Francisco, CA (PST)"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>
        </div>

        {/* Profile Image with Uploader */}
        <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#00007B]/15">
          <IconOrImageUpload
            label="Profile Avatar Image (Upload or URL)"
            value={profile.profileImage || ''}
            onChange={(url) => handleChange('profileImage', url)}
            helperText="Upload your headshot or enter image link"
            mode="image"
          />
        </div>

        {/* URLs & Media */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Resume Download URL
            </label>
            <input
              type="text"
              value={profile.resumeUrl || ''}
              onChange={(e) => handleChange('resumeUrl', e.target.value)}
              placeholder="/uploads/resume.pdf or https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              Personal Website URL
            </label>
            <input
              type="url"
              value={profile.websiteUrl || ''}
              onChange={(e) => handleChange('websiteUrl', e.target.value)}
              placeholder="https://alexmorgan.dev"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              GitHub Profile URL
            </label>
            <input
              type="url"
              value={profile.githubUrl || ''}
              onChange={(e) => handleChange('githubUrl', e.target.value)}
              placeholder="https://github.com/alexmorgan"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#00007B] mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={profile.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/alexmorgan"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] text-sm focus:outline-none focus:border-[#0F9A73]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#00007B]/10 flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={saving} className="shadow-md">
            <Save className="w-4 h-4 mr-2" />
            <span>Save Profile Configuration</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
