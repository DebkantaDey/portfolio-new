import React from 'react';
import Link from 'next/link';
import { Award, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { TechIcon } from '../common/TechIcon';
import { Certification } from '../../types';
import { formatDate } from '../../lib/utils';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  return (
    <section className="py-20 bg-white border-t border-[#00007B]/10">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs uppercase font-mono tracking-widest text-[#0F9A73] font-bold">Verified Credentials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight mt-1">
              Certifications &amp; Accreditations
            </h2>
          </div>
          <Link href="/certifications">
            <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
              <span>View All Certifications</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#0F9A73]" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#f8fafd] border border-[#00007B]/15 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#00007B]/15 flex items-center justify-center p-1.5 shadow-sm shrink-0">
                    {cert.organizationLogo ? (
                      <TechIcon name={cert.organizationLogo} size={22} />
                    ) : (
                      <Award className="w-5 h-5 text-[#0F9A73]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#00007B] leading-snug">{cert.title}</h3>
                    <p className="text-xs text-[#0F9A73] font-mono mt-0.5 font-semibold">{cert.issuingOrganization}</p>
                  </div>
                </div>

                {cert.description && (
                  <p className="text-xs text-[#00007B]/80 line-clamp-3 leading-relaxed mb-4">
                    {cert.description}
                  </p>
                )}

                <div className="space-y-1 text-[11px] font-mono text-[#00007B]/70 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span>Issued: {formatDate(cert.issueDate)}</span>
                  </div>
                  {cert.credentialId && (
                    <div className="text-[#00007B]/80">
                      ID: <span className="text-[#0F9A73] font-bold">{cert.credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              {cert.credentialUrl && (
                <div className="pt-4 border-t border-[#00007B]/10">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9A73] hover:text-[#00007B] transition-colors"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
