'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Globe, Cpu, Box, Check, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { Service } from '../../types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    Layers: <Layers className="w-8 h-8 text-[#0F9A73]" />,
    Globe: <Globe className="w-8 h-8 text-[#0F9A73]" />,
    Cpu: <Cpu className="w-8 h-8 text-[#0F9A73]" />,
    Box: <Box className="w-8 h-8 text-[#0F9A73]" />,
  };

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
          <Badge variant="cyan">Capabilities &amp; Offerings</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight mt-2">
            Engineering Services
          </h1>
          <p className="text-[#00007B]/70 text-sm sm:text-base mt-2 max-w-2xl font-normal">
            Specialized solutions ranging from architecture audits and modern full-stack web builds to high-throughput backend services and cloud deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-[#00007B]/15 p-8 rounded-3xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-xl transition-all shadow-sm"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0F9A73]/10 border border-[#0F9A73]/20 flex items-center justify-center mb-6">
                  {iconMap[service.icon || 'Layers'] || <Layers className="w-8 h-8 text-[#0F9A73]" />}
                </div>

                <h2 className="text-xl font-bold text-[#00007B] mb-2">{service.title}</h2>
                <p className="text-sm text-[#00007B]/80 leading-relaxed mb-6 font-normal">
                  {service.fullDescription || service.shortDescription}
                </p>

                {service.features && service.features.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xs uppercase font-mono font-bold text-[#00007B]/70 tracking-wider">
                      Included Capabilities
                    </h3>
                    <ul className="space-y-2">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#00007B]/85">
                          <Check className="w-4 h-4 text-[#0F9A73] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.technologies && service.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#f8fafd] text-[#00007B] border border-[#00007B]/15"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#00007B]/10 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-[#0F9A73] hover:text-[#00007B] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Detailed Service Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
                    <span>Inquire</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
