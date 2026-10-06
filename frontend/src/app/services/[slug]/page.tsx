'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../lib/api';
import { Service } from '../../../types';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api
        .getServiceBySlug(slug as string)
        .then(setService)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-white text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#0F9A73] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#00007B]/70 font-mono mt-3">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-white text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-[#00007B]">Service Not Found</h1>
        <p className="text-[#00007B]/70 text-sm mt-2">The requested service does not exist or was moved.</p>
        <Link href="/services" className="mt-6 inline-block">
          <Button variant="primary" size="md">
            View All Services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0F9A73] hover:underline font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Services</span>
        </Link>

        <div>
          <Badge variant="cyan">Specialized Offering</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight mt-3">
            {service.title}
          </h1>
          <p className="text-[#00007B]/80 text-base sm:text-lg leading-relaxed mt-4">
            {service.shortDescription}
          </p>
        </div>

        {/* Deep Dive Content */}
        <div className="bg-[#f8fafd] border border-[#00007B]/15 p-8 rounded-3xl space-y-8 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#00007B] mb-3">Service Scope &amp; Philosophy</h2>
            <p className="text-sm text-[#00007B]/85 leading-relaxed font-normal">
              {service.fullDescription}
            </p>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="pt-6 border-t border-[#00007B]/10">
              <h2 className="text-xl font-bold text-[#00007B] mb-4">Included Capabilities &amp; Deliverables</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#00007B]/15">
                    <CheckCircle2 className="w-5 h-5 text-[#0F9A73] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#00007B] font-medium leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.technologies && service.technologies.length > 0 && (
            <div className="pt-6 border-t border-[#00007B]/10">
              <h2 className="text-base font-bold text-[#00007B] mb-3">Primary Technologies Leveraged</h2>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-lg text-xs font-mono bg-white text-[#00007B] border border-[#00007B]/15">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-[#00007B] border border-[#0F9A73]/40 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div>
            <h3 className="text-xl font-bold text-white">Interested in this service?</h3>
            <p className="text-xs text-white/80 mt-1">Let&apos;s discuss timelines, scope, and technical requirements.</p>
          </div>
          <Link href="/contact">
            <Button variant="primary" size="md" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
              <Mail className="w-4 h-4 mr-2" />
              <span>Request Consultation</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
