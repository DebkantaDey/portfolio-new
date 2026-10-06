'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Github, BookOpen, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { Project } from '../../types';
import { BrowserMockup } from '../common/BrowserMockup';

interface FeaturedProjectsProps {
  projects: Project[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  const featuredList = projects.filter((p) => p.featured || p.published).slice(0, 3);

  return (
    <section className="py-24 bg-[#f8fafd] border-t border-[#00007B]/10 relative">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F9A73]/15 border border-[#0F9A73]/40 text-[#0F9A73] text-xs font-mono mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Production Architectures</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00007B] tracking-tight">
              Featured Case Studies &amp; Systems
            </h2>
            <p className="text-sm sm:text-base text-[#00007B]/80 mt-2 max-w-2xl">
              Real-world systems engineered for resilience, sub-second latency, and horizontal scalability.
            </p>
          </div>

          <Link href="/projects">
            <Button variant="outline" size="sm" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
              <span>View All Systems ({projects.length})</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#0F9A73]" />
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredList.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-[#00007B]/15 rounded-2xl overflow-hidden hover:border-[#0F9A73] hover:shadow-2xl transition-all duration-300 flex flex-col group"
            >
              {/* Browser Window Mockup Frame */}
              <div className="p-3 bg-[#f0f4fc] border-b border-[#00007B]/10">
                <BrowserMockup
                  url={project.liveUrl || `https://${project.slug}.dev`}
                  imageSrc={project.featuredImage}
                  imageAlt={project.title}
                  title={project.title}
                />
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#0F9A73] font-bold">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00007B]/5 text-[#00007B] border border-[#00007B]/10">
                      {project.projectType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#00007B] group-hover:text-[#0F9A73] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#00007B]/80 line-clamp-3 leading-relaxed mt-2">
                    {project.shortDescription}
                  </p>
                </div>

                <div>
                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#f8fafd] text-[#00007B] border border-[#00007B]/15"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#00007B]/10 flex items-center justify-between">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9A73] hover:text-[#00007B] transition-colors group/link"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Deep Dive Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[#f8fafd] border border-[#00007B]/10 text-[#00007B]/70 hover:text-[#00007B] hover:border-[#00007B]/30 transition-colors"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[#0F9A73]/10 border border-[#0F9A73]/30 text-[#0F9A73] hover:bg-[#0F9A73] hover:text-white transition-all"
                          title="Open Live Deployment"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
