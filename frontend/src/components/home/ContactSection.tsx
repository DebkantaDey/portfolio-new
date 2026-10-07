'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { Profile } from '../../types';
import { useToast } from '../ui/Toast';
import { CopyButton } from '../common/CopyButton';
import { useSettings } from '@/context/SettingsContext';

interface ContactSectionProps {
  profile?: Profile | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { toast } = useToast();
  const { getSetting } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '', // anti-spam hidden trap
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const email = getSetting('contactEmail') || profile?.email || 'alex@alexmorgan.dev';
  const location = getSetting('location') || profile?.location || 'San Francisco, CA • PST (UTC-8)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      await api.submitContact(formData);
      setStatus({
        type: 'success',
        message: 'Message delivered! Your inquiry has been routed directly to my inbox.',
      });
      toast({
        type: 'success',
        title: 'Message Sent Successfully',
        message: 'Thank you! I usually review and respond to inquiries within 12-24 hours.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      const msg = err.message || 'Unable to deliver message. Please reach out directly via email.';
      setStatus({
        type: 'error',
        message: msg,
      });
      toast({
        type: 'error',
        title: 'Submission Failed',
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white border-t border-[#00007B]/10 relative">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Inquiries & Engineering Availability */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono font-bold mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>Direct Communication Channel</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight">
                Let&apos;s Build Something Resilient
              </h2>
              <p className="text-sm sm:text-base text-[#00007B]/80 mt-3 leading-relaxed">
                Whether you have an ambitious greenfield project, an existing architecture to modernize, or an exciting full-time leadership role, my inbox is open.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Email Direct Card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/15 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0F9A73]/15 border border-[#0F9A73]/40 flex items-center justify-center text-[#0F9A73] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#00007B]/60 font-mono">Direct Email</span>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-bold text-[#00007B] hover:text-[#0F9A73] transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
                <CopyButton text={email} label="Copy" />
              </div>

              {/* Location Card */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/15 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#0F9A73]/15 border border-[#0F9A73]/40 flex items-center justify-center text-[#0F9A73] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] text-[#00007B]/60 font-mono">Location &amp; Timezone</span>
                  <span className="text-sm font-bold text-[#00007B]">
                    {location}
                  </span>
                </div>
              </div>

              {/* SLA Response Guarantee */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#f8fafd] border border-[#00007B]/15 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#0F9A73]/15 border border-[#0F9A73]/40 flex items-center justify-center text-[#0F9A73] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] text-[#00007B]/60 font-mono">Response Protocol</span>
                  <span className="text-sm font-bold text-[#0F9A73]">
                    Guaranteed reply within 12 - 24 hours
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy & Anti-Spam reassurance */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#00007B]/70">
              <ShieldCheck className="w-4 h-4 text-[#0F9A73]" />
              <span>No spam or trackers. Direct engineer response.</span>
            </div>
          </div>

          {/* Right Column: Handcrafted Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border-2 border-[#00007B]/15 rounded-3xl p-8 sm:p-10 shadow-xl">
              {/* <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#00007B]/10">
                <h3 className="text-xl font-bold text-[#00007B]">Direct Message Transmission</h3>
                <span className="text-[11px] font-mono text-[#0F9A73] font-bold bg-[#0F9A73]/10 px-2 py-0.5 rounded border border-[#0F9A73]/30">Encrypted / PostgreSQL</span>
              </div> */}

              {status && (
                <div
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
                    status.type === 'success'
                      ? 'bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#00007B]'
                      : 'bg-rose-50 border border-rose-300 text-rose-800'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-[#0F9A73] shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs sm:text-sm font-medium">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-sm focus:outline-none focus:border-[#0F9A73] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-sm focus:outline-none focus:border-[#0F9A73] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-sm focus:outline-none focus:border-[#0F9A73] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                      Subject / Intent *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Staff Full-Stack Position"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-sm focus:outline-none focus:border-[#0F9A73] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your technical requirements, team context, or proposed engagement..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-sm focus:outline-none focus:border-[#0F9A73] focus:bg-white transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full justify-center bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Send Direct Message</span>
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
