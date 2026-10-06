'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, ExternalLink, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { TechIcon } from '../../components/common/TechIcon';
import { api } from '../../lib/api';
import { Certification } from '../../types';
import { formatDate } from '../../lib/utils';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    api.getCertifications().then(setCertifications).catch(console.error);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0F9A73] hover:underline font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div>
          <Badge variant="cyan">Accreditations</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight mt-2">
            Licenses &amp; Certifications
          </h1>
          <p className="text-[#00007B]/70 text-sm sm:text-base mt-2 max-w-2xl font-normal">
            Independently verified industry certifications in cloud architecture, container orchestration, and frontend systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-white border border-[#00007B]/15 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-xl transition-all shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f8fafd] border border-[#00007B]/15 flex items-center justify-center p-1.5 shadow-inner mb-4">
                  {cert.organizationLogo ? (
                    <TechIcon name={cert.organizationLogo} size={28} />
                  ) : (
                    <Award className="w-6 h-6 text-[#0F9A73]" />
                  )}
                </div>
                {cert.certificateImage && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-[#00007B]/15 aspect-video bg-[#f8fafd]">
                    <img
                      src={cert.certificateImage}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="text-lg font-bold text-[#00007B] mb-1">{cert.title}</h2>
                <p className="text-xs font-mono text-[#0F9A73] mb-4 font-semibold">{cert.issuingOrganization}</p>
                {cert.description && (
                  <p className="text-xs text-[#00007B]/80 leading-relaxed mb-6 font-normal">
                    {cert.description}
                  </p>
                )}

                <div className="space-y-1 text-xs font-mono text-[#00007B]/70 mb-6 pb-4 border-b border-[#00007B]/10">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span>Issued: {formatDate(cert.issueDate)}</span>
                  </div>
                  {cert.credentialId && (
                    <div>
                      Credential ID: <span className="text-[#00007B] font-bold">{cert.credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9A73] hover:text-[#00007B] transition-colors"
                >
                  <span>Verify at Issuer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
