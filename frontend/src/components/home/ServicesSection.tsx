'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Globe, Cpu, Box, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Service } from '../../types';

interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Layers: <Layers className="w-5 h-5 text-[#0F9A73]" />,
    Globe: <Globe className="w-5 h-5 text-[#0F9A73]" />,
    Cpu: <Cpu className="w-5 h-5 text-[#0F9A73]" />,
    Box: <Box className="w-5 h-5 text-[#0F9A73]" />,
  };

  return (
    <section className="py-24 bg-[#f8fafd] border-t border-[#00007B]/10 relative">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Technical Consulting</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight">
              Engineering Services &amp; Advisory
            </h2>
            <p className="text-sm sm:text-base text-[#00007B]/80 mt-2 max-w-2xl">
              Turnkey architectural consulting, full-stack product development, and systems modernization tailored for high-growth tech ventures.
            </p>
          </div>

          <Link href="/services">
            <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#0F9A73]" />
            </Button>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-[#00007B]/15 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0F9A73] hover:shadow-xl transition-all duration-200 group"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#0F9A73]/10 border border-[#0F9A73]/20 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#0F9A73] transition-all">
                  {iconMap[service.icon || 'Layers'] || <Layers className="w-5 h-5 text-[#0F9A73]" />}
                </div>

                <h3 className="text-lg font-bold text-[#00007B] mb-2 group-hover:text-[#0F9A73] transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-[#00007B]/80 leading-relaxed mb-6">
                  {service.shortDescription}
                </p>

                {/* Features list */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#00007B]/85">
                        <Check className="w-3.5 h-3.5 text-[#0F9A73] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-[#00007B]/10">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-[#0F9A73] hover:text-[#00007B] inline-flex items-center gap-1.5 transition-colors group/link"
                >
                  <span>Explore service details</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
