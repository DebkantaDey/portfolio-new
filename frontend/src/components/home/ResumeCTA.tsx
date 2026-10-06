import React from 'react';
import Link from 'next/link';
import { Download, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface ResumeCTAProps {
  resumeUrl?: string | null;
}

export const ResumeCTA: React.FC<ResumeCTAProps> = ({ resumeUrl }) => {
  const downloadLink = resumeUrl || '/uploads/Alex_Morgan_Resume.pdf';

  return (
    <section className="py-20 bg-[#f8fafd] border-t border-[#00007B]/10">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#00007B] border border-[#0F9A73]/40 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl text-white">
          <div className="space-y-3 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/20 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Comprehensive Credentials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Looking for a Complete Technical Summary?
            </h2>
            <p className="text-sm text-white/85 leading-relaxed">
              Download my updated curriculum vitae detailing 8+ years of software architecture, engineering leadership, distributed systems experience, and technical achievements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link href="/resume" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto justify-center border-white/30 text-white hover:bg-white/10">
                <FileText className="w-4 h-4 mr-2" />
                <span>View Online CV</span>
              </Button>
            </Link>
            <a href={downloadLink} download="Alex_Morgan_Resume.pdf" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto justify-center bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
                <Download className="w-4 h-4 mr-2 text-white" />
                <span>Download PDF Resume</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
