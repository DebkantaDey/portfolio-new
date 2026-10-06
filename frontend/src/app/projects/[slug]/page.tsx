'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ExternalLink,
  Github,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Share2,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../lib/api';
import { Project } from '../../../types';
import { formatDate } from '../../../lib/utils';
import { BrowserMockup } from '../../../components/common/BrowserMockup';
import { CopyButton } from '../../../components/common/CopyButton';
import { TechIcon } from '../../../components/common/TechIcon';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (slug) {
      api
        .getProjectBySlug(slug)
        .then((data) => {
          setProject(data);
          // fetch all to grab related
          api.getProjects().then((all) => {
            setRelatedProjects(all.filter((p) => p.slug !== slug).slice(0, 2));
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-white text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#0F9A73] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#00007B]/70 font-mono mt-3">Compiling case study telemetry...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-white text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-[#00007B]">Project Case Study Not Found</h1>
        <p className="text-[#00007B]/70 text-sm mt-2">The requested project could not be found or has been archived.</p>
        <Link href="/projects" className="mt-6 inline-block">
          <Button variant="primary" size="md">
            View All Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-white bg-grid">
      <div className="w-full lg:w-[80%] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation Breadcrumb & Copy URL */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0F9A73] hover:underline font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&larr; Back to Systems Gallery</span>
          </Link>

          <CopyButton
            text={typeof window !== 'undefined' ? window.location.href : `https://alexmorgan.dev/projects/${slug}`}
            label="Share Link"
          />
        </div>

        {/* Project Hero Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/40">
              {project.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#00007B] bg-[#00007B]/5 border border-[#00007B]/15">
              {project.projectType}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#0F9A73]/15 text-[#0F9A73] border border-[#0F9A73]/40">
              ● {project.status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#00007B] tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-[#00007B]/80 text-base sm:text-lg leading-relaxed max-w-3xl">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <Button variant="primary" size="md" className="bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>Launch Live Platform</span>
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="md" className="border-[#00007B]/20 text-[#00007B] hover:border-[#0F9A73] hover:text-[#0F9A73]">
                  <Github className="w-4 h-4 mr-2 text-[#0F9A73]" />
                  <span>Inspect Repository</span>
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Browser Window Mockup Container */}
        <div className="p-3 bg-[#f8fafd] border border-[#00007B]/15 rounded-2xl shadow-xl">
          <BrowserMockup
            url={project.liveUrl || `https://${project.slug}.dev`}
            imageSrc={project.featuredImage}
            imageAlt={project.title}
            title={project.title}
          />
        </div>

        {/* Technical Architecture & Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Body */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#00007B] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0F9A73]" />
                Architectural Scope &amp; Executive Summary
              </h2>
              <div className="prose max-w-none text-sm sm:text-base text-[#00007B]/85 leading-relaxed font-normal">
                {project.fullDescription}
              </div>
            </section>

            {/* Key Features Checklist */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-[#00007B]/10">
                <h2 className="text-xl font-bold text-[#00007B] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0F9A73]" />
                  Key System Features &amp; Capabilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-[#f8fafd] p-4 rounded-xl border border-[#00007B]/15"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#0F9A73] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#00007B] font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Engineering Challenges & Solutions */}
            {(project.challenges || project.solutions) && (
              <section className="space-y-6 pt-6 border-t border-[#00007B]/10">
                <h2 className="text-xl font-bold text-[#00007B]">Engineering Deep-Dive</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.challenges && (
                    <div className="bg-[#f8fafd] border border-amber-300/60 p-6 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Core Technical Challenge</span>
                      </div>
                      <p className="text-xs text-[#00007B]/80 leading-relaxed font-normal">
                        {project.challenges}
                      </p>
                    </div>
                  )}

                  {project.solutions && (
                    <div className="bg-[#f8fafd] border border-[#0F9A73]/40 p-6 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-[#0F9A73] font-bold text-sm">
                        <Lightbulb className="w-4 h-4" />
                        <span>Architectural Solution</span>
                      </div>
                      <p className="text-xs text-[#00007B]/80 leading-relaxed font-normal">
                        {project.solutions}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Screenshots Gallery */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-[#00007B]/10">
                <h2 className="text-xl font-bold text-[#00007B]">Interface Gallery &amp; Architecture Diagrams</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-2xl overflow-hidden border border-[#00007B]/15 bg-[#f8fafd]"
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar Metadata */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#f8fafd] border border-[#00007B]/15 p-6 rounded-3xl space-y-6 shadow-sm">
              <div>
                <h3 className="text-xs uppercase font-mono font-bold text-[#00007B]/70 tracking-wider mb-2">
                  Role &amp; Ownership
                </h3>
                <div className="flex items-start gap-2.5 text-xs text-[#00007B] leading-relaxed">
                  <UserCheck className="w-4 h-4 text-[#0F9A73] shrink-0 mt-0.5" />
                  <span>
                    {project.responsibilities ||
                      'Principal Architect & Lead Full-Stack Developer: Designed database schema, engineered REST APIs, and built responsive UI.'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#00007B]/10">
                <h3 className="text-xs uppercase font-mono font-bold text-[#00007B]/70 tracking-wider mb-2">
                  Deployment Period
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00007B]">
                  <Calendar className="w-4 h-4 text-[#0F9A73]" />
                  <span>
                    {formatDate(project.startDate)} — {formatDate(project.endDate)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#00007B]/10">
                <h3 className="text-xs uppercase font-mono font-bold text-[#00007B]/70 tracking-wider mb-3">
                  Production Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-white text-[#00007B] border border-[#00007B]/15 font-semibold shadow-sm"
                    >
                      <TechIcon name={t} size={14} />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div className="pt-16 border-t border-[#00007B]/10 space-y-6">
            <h2 className="text-2xl font-bold text-[#00007B]">More Related Systems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/projects/${rel.slug}`}
                  className="bg-white border border-[#00007B]/15 p-6 rounded-2xl hover:border-[#0F9A73] hover:shadow-lg transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#0F9A73] uppercase font-bold">{rel.category}</span>
                    <h3 className="text-base font-bold text-[#00007B] group-hover:text-[#0F9A73] transition-colors">
                      {rel.title}
                    </h3>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#00007B]/60 group-hover:text-[#0F9A73]" />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
