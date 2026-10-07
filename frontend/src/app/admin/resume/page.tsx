'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Code2,
  Download,
  Printer,
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  Eye,
  Sliders,
  Check,
  Copy,
  ExternalLink,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Palette,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Play,
  Columns,
  Square,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Layout,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../lib/api';
import { toast } from 'sonner';
import {
  LATEX_TEMPLATES,
  LatexTemplateMeta,
  generateLatexFromPortfolio,
  parseLatexToHtml,
  splitHtmlIntoA4Pages,
  extractTwoColumnsFromLatex,
  assembleTwoColumnLatex,
  PortfolioResumeData,
} from '../../../lib/latexParser';
import {
  exportResumeAsPdf,
  exportResumeAsDocx,
  exportResumeAsImage,
  exportLatexFile,
  printResumeElement,
} from '../../../lib/resumeExporter';

type ResumeMode = 'latex' | 'docs';
type DocsLayout = 'single' | 'two-column';
type DocsFont = 'Inter' | 'Merriweather' | 'Space Grotesk' | 'Roboto' | 'JetBrains Mono';

const COLOR_THEMES = [
  { id: 'navy', name: 'Royal Navy', primary: '#00007B', accent: '#0F9A73' },
  { id: 'slate', name: 'Slate Obsidian', primary: '#0F172A', accent: '#0284C7' },
  { id: 'emerald', name: 'Deep Forest', primary: '#064E3B', accent: '#10B981' },
  { id: 'burgundy', name: 'Imperial Rose', primary: '#4C0519', accent: '#E11D48' },
  { id: 'amber', name: 'Charcoal & Amber', primary: '#18181B', accent: '#F59E0B' },
];

const INITIAL_PORTFOLIO_DATA: PortfolioResumeData = {
  fullName: 'Debkanta Dey',
  professionalTitle: 'Senior Full-Stack Engineer & Cloud Architect',
  email: 'alex@alexmorgan.dev',
  phone: '+1 (415) 890-4211',
  location: 'San Francisco, CA (Remote)',
  websiteUrl: 'https://alexmorgan.dev',
  githubUrl: 'https://github.com/alexmorgan',
  linkedinUrl: 'https://linkedin.com/in/alexmorgan-dev',
  summary:
    'Senior full-stack software engineer and cloud architect with 8+ years designing high-throughput cloud architectures, deterministic TypeScript microservices, and high-performance Next.js web applications scaling to 40M+ daily requests. Proven track record leading agile squads, cutting cloud expenditures by 42%, and building fault-tolerant transactional architectures.',
  experiences: [
    {
      title: 'Senior Full-Stack Architect & Tech Lead',
      company: 'Nexus Cloud Systems',
      location: 'San Francisco, CA',
      startDate: 'Mar 2022',
      endDate: 'Present',
      current: true,
      description:
        'Architected distributed microservices powering 40M+ daily telemetry events using Next.js 15, Node.js, and PostgreSQL.\nSpearheaded migration to serverless edge computing, reducing p99 API latency by 42% and cloud costs by $180K/yr.\nMentored 12 mid-level and junior software engineers across three cross-functional agile engineering squads.\nImplemented Redis multi-tier caching and database read replicas, cutting mean query latency from 340ms to 45ms.',
    },
    {
      title: 'Lead Software Engineer',
      company: 'Vanguard Financial Technologies',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Feb 2022',
      current: false,
      description:
        'Built real-time cryptographic transaction auditing pipelines with zero downtime across 2+ years of operation.\nEngineered performant React component system, boosting client page speed scores from 64 to 98 on Core Web Vitals.\nIntegrated automated CI/CD security pipelines using GitHub Actions, Docker, and Kubernetes clusters.\nDesigned idempotent payment settlement services processing $15M+ in weekly transaction volume with zero financial drift.',
    },
    {
      title: 'Full-Stack Developer',
      company: 'Nova Interactive Labs',
      location: 'Austin, TX',
      startDate: 'Jun 2018',
      endDate: 'Dec 2019',
      current: false,
      description:
        'Built custom web applications, RESTful microservices, and interactive data visualization dashboards for 15+ clients.\nAuthored reusable React component libraries and design tokens adopted company-wide by 30+ engineers.\nDelivered all customer milestones on schedule with zero critical production bugs and 99.8% test coverage.',
    },
  ],
  educations: [
    {
      degree: 'B.S. in Computer Science, Magna Cum Laude',
      institution: 'University of California, Berkeley',
      fieldOfStudy: 'Computer Science & Software Systems',
      startDate: '2014',
      endDate: '2018',
      grade: 'GPA: 3.89 / 4.00',
    },
    {
      degree: 'Executive Engineering Leadership Credential',
      institution: 'Stanford Center for Professional Development',
      fieldOfStudy: 'Distributed Systems Architecture',
      startDate: '2020',
      endDate: '2021',
      grade: 'With Distinction',
    },
  ],
  skills: [
    { name: 'TypeScript', category: 'Languages' },
    { name: 'JavaScript', category: 'Languages' },
    { name: 'Python', category: 'Languages' },
    { name: 'Go', category: 'Languages' },
    { name: 'SQL (PostgreSQL)', category: 'Languages' },
    { name: 'Bash', category: 'Languages' },
    { name: 'Next.js 15', category: 'Frameworks' },
    { name: 'React', category: 'Frameworks' },
    { name: 'Node.js', category: 'Frameworks' },
    { name: 'Express', category: 'Frameworks' },
    { name: 'TailwindCSS', category: 'Frameworks' },
    { name: 'Prisma ORM', category: 'Frameworks' },
    { name: 'PostgreSQL', category: 'Databases & Infrastructure' },
    { name: 'Redis', category: 'Databases & Infrastructure' },
    { name: 'Apache Kafka', category: 'Databases & Infrastructure' },
    { name: 'Docker', category: 'Databases & Infrastructure' },
    { name: 'Kubernetes', category: 'Databases & Infrastructure' },
    { name: 'AWS (EC2, S3, RDS)', category: 'Databases & Infrastructure' },
    { name: 'Google Cloud Platform', category: 'Databases & Infrastructure' },
  ],
  projects: [
    {
      title: 'Distributed Cache Fabric',
      technologies: ['Go', 'Redis', 'gRPC', 'Docker', 'Prometheus'],
      shortDescription:
        'High-performance in-memory caching layer handling 150K QPS with sub-millisecond p95 read latency and automated multi-node failover.',
    },
    {
      title: 'AuraFlow -- Collaborative AI Workspace',
      technologies: ['Next.js 15', 'TypeScript', 'WebSockets', 'PostgreSQL'],
      shortDescription:
        'Real-time collaborative canvas and document processing suite powered by CRDT conflict resolution and multimodal AI agents.',
    },
    {
      title: 'NovaPay -- Multi-Currency Merchant Ledger',
      technologies: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Prisma'],
      shortDescription:
        'Double-entry bookkeeping engine guaranteeing zero ledger imbalances across 35+ global fiat currencies with strict audit verification.',
    },
  ],
};

// Miniature Visual Resume UI Structure Thumbnail for Design Gallery
function ResumeTemplateThumbnail({ templateId }: { templateId: string }) {
  if (templateId === 'deedy') {
    return (
      <div className="h-56 w-full bg-slate-50 rounded-xl border border-slate-200 p-2 overflow-hidden text-[6px] leading-tight select-none flex gap-2 shadow-sm hover:border-[#0F9A73] transition-colors">
        {/* Page 1 (Column 1 - Credentials & Skills) */}
        <div className="w-1/2 bg-white rounded-lg p-2 border border-slate-200 flex flex-col justify-start space-y-1 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
            <span className="font-bold text-[6px] text-slate-900 font-mono">PAGE 1 (COL 1)</span>
            <span className="text-[5px] bg-slate-100 text-slate-600 px-1 rounded font-mono">Profile</span>
          </div>
          <div>
            <div className="font-bold text-[7px] text-slate-900">Debkanta Dey</div>
            <div className="text-[5px] text-slate-500 truncate">alex@morgan.dev • SF, CA</div>
          </div>
          <div>
            <div className="font-bold text-[5.5px] uppercase text-slate-800 border-b border-slate-800 pb-0.2 mb-0.5">Contact</div>
            <div className="text-[5px] text-slate-600 truncate">github.com/alex • linkedin</div>
          </div>
          <div>
            <div className="font-bold text-[5.5px] uppercase text-slate-800 border-b border-slate-800 pb-0.2 mb-0.5">Education</div>
            <div className="font-bold text-[5.5px] text-slate-800">UC Berkeley</div>
            <div className="text-[5px] text-slate-500">B.S. CS • GPA 3.89</div>
          </div>
          <div>
            <div className="font-bold text-[5.5px] uppercase text-slate-800 border-b border-slate-800 pb-0.2 mb-0.5">Skills</div>
            <div className="flex flex-wrap gap-0.5">
              <span className="bg-slate-100 text-slate-700 px-1 py-0.2 rounded text-[4.5px]">TS</span>
              <span className="bg-slate-100 text-slate-700 px-1 py-0.2 rounded text-[4.5px]">Next.js</span>
              <span className="bg-slate-100 text-slate-700 px-1 py-0.2 rounded text-[4.5px]">Go</span>
              <span className="bg-slate-100 text-slate-700 px-1 py-0.2 rounded text-[4.5px]">Postgres</span>
            </div>
          </div>
          <div>
            <div className="font-bold text-[5.5px] uppercase text-slate-800 border-b border-slate-800 pb-0.2 mb-0.5">Awards</div>
            <div className="text-[4.5px] text-slate-600 truncate">AWS Architect • Hackathon 1st</div>
          </div>
        </div>

        {/* Page 2 (Column 2 - Career History & Projects) */}
        <div className="w-1/2 bg-white rounded-lg p-2 border border-slate-200 flex flex-col justify-start space-y-1 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
            <span className="font-bold text-[6px] text-slate-900 font-mono">PAGE 2 (COL 2)</span>
            <span className="text-[5px] bg-emerald-50 text-[#0F9A73] px-1 rounded font-mono font-bold">Experience</span>
          </div>
          <div>
            <div className="font-bold text-[5.5px] uppercase text-slate-800 border-b border-slate-800 pb-0.2 mb-0.5">Career History</div>
            <div className="font-bold text-[5.5px] text-slate-900 truncate">Senior Full-Stack Architect</div>
            <div className="text-[5px] text-slate-500">Nexus Cloud • 2022–Pres</div>
            <div className="text-[4.5px] text-slate-600 pl-0.5 space-y-0.2">
              <div>• 40M+ daily events</div>
              <div>• 42% API latency cut</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-[5.5px] text-slate-900 truncate">Lead Software Engineer</div>
            <div className="text-[5px] text-slate-500">Vanguard • 2020–2022</div>
          </div>
          <div>
            <div className="font-bold text-[5.5px] uppercase text-slate-800 border-b border-slate-800 pb-0.2 mb-0.5">Projects</div>
            <div className="text-[5px] font-bold text-slate-900 truncate">Cache Fabric (150K QPS)</div>
            <div className="text-[5px] font-bold text-slate-900 truncate">AuraFlow AI Workspace</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'executive_split') {
    return (
      <div className="h-56 w-full bg-slate-100 rounded-xl border border-slate-200 p-2 overflow-hidden text-[6px] leading-tight select-none flex gap-2 shadow-sm hover:border-[#0F9A73] transition-colors">
        {/* Page 1 (Column 1 - Dark Slate Executive Profile) */}
        <div className="w-1/2 bg-slate-900 text-white rounded-lg p-2 border border-slate-800 flex flex-col justify-start space-y-1 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-0.5">
            <span className="font-bold text-[6px] text-[#0F9A73] font-mono">PAGE 1 (COL 1)</span>
            <span className="text-[5px] bg-slate-800 px-1 rounded text-slate-300 font-mono">Executive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-[#0F9A73] text-slate-950 font-bold text-[6px] flex items-center justify-center">AM</div>
            <div className="min-w-0">
              <div className="font-bold text-[6.5px] truncate">Debkanta Dey</div>
              <div className="text-[5px] text-slate-400 truncate">VP Architecture</div>
            </div>
          </div>
          <div>
            <div className="text-[5.5px] font-bold uppercase text-[#0F9A73] mb-0.5">Strategic Focus</div>
            <div className="text-[4.5px] text-slate-300 line-clamp-2">Distributed Systems, Cloud Economics, FinOps, Squad Leadership</div>
          </div>
          <div>
            <div className="text-[5.5px] font-bold uppercase text-[#0F9A73] mb-0.5">Credentials</div>
            <div className="text-[4.5px] text-slate-300">UC Berkeley (B.S. CS)</div>
            <div className="text-[4.5px] text-slate-400">AWS Solutions Architect</div>
          </div>
          <div>
            <div className="text-[5.5px] font-bold uppercase text-[#0F9A73] mb-0.5">Core Stack</div>
            <div className="text-[4.5px] text-slate-300">Go, Node.js, Next.js, K8s</div>
          </div>
        </div>

        {/* Page 2 (Column 2 - Clean White Milestones) */}
        <div className="w-1/2 bg-white rounded-lg p-2 border border-slate-200 flex flex-col justify-start space-y-1 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
            <span className="font-bold text-[6px] text-slate-900 font-mono">PAGE 2 (COL 2)</span>
            <span className="text-[5px] bg-emerald-50 text-[#0F9A73] px-1 rounded font-mono font-bold">Milestones</span>
          </div>
          <div>
            <div className="text-[5.5px] font-bold uppercase text-slate-900 border-b border-slate-800 pb-0.2 mb-0.5">Milestones</div>
            <div className="font-bold text-[5.5px] text-slate-900 truncate">VP Architecture</div>
            <div className="text-[5px] text-slate-500">Nexus Cloud • 2022–Pres</div>
            <div className="text-[4.5px] text-slate-600 pl-0.5">
              <div>• Scaled to $40M volume</div>
              <div>• Mentored 12 devs</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-[5.5px] text-slate-900 truncate">Director of Software</div>
            <div className="text-[5px] text-slate-500">Vanguard • 2020–2022</div>
          </div>
          <div>
            <div className="text-[5.5px] font-bold uppercase text-slate-900 border-b border-slate-800 pb-0.2 mb-0.5">Flagship Systems</div>
            <div className="text-[5px] text-slate-800 truncate">Distributed Cache Fabric</div>
            <div className="text-[5px] text-slate-800 truncate">Fraud Settlement Mesh</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'harvard') {
    return (
      <div className="h-56 w-full bg-white rounded-xl border border-slate-200 p-2.5 overflow-hidden text-[6.5px] leading-tight select-none flex flex-col justify-start relative shadow-sm hover:border-[#0F9A73] transition-colors font-serif">
        {/* Harvard Serif Header */}
        <div className="text-center pb-1">
          <div className="font-bold text-[9px] text-slate-900 uppercase tracking-widest">Debkanta Dey</div>
          <div className="border-y border-slate-800 py-0.5 my-1 text-[6px] text-slate-700 italic">
            San Francisco, CA • alex@alexmorgan.dev • +1 (415) 890-4211
          </div>
        </div>

        {/* Education */}
        <div className="mt-1">
          <div className="text-[7px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1">
            Education
          </div>
          <div className="flex justify-between font-bold text-slate-800 text-[6px]">
            <span>Harvard University</span>
            <span className="font-normal italic text-slate-500">Cambridge, MA</span>
          </div>
          <div className="flex justify-between text-[5.5px] italic text-slate-600">
            <span>Bachelor of Arts in Computer Science, Magna Cum Laude</span>
            <span className="text-slate-500">May 2019</span>
          </div>
        </div>

        {/* Professional Experience */}
        <div className="mt-2">
          <div className="text-[7px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1">
            Professional Experience
          </div>
          <div className="flex justify-between font-bold text-slate-800 text-[6px]">
            <span>Senior Systems Architect</span>
            <span className="font-normal italic text-slate-500">2022 – Present</span>
          </div>
          <div className="text-[5.5px] italic text-slate-600 mb-0.5">Nexus Cloud Systems, San Francisco, CA</div>
          <div className="text-[5.5px] text-slate-700 pl-2 space-y-0.5">
            <div>— Directed distributed platform powering 10,000,000+ daily analytical events.</div>
            <div>— Authored technical RFCs on high-availability consensus topologies.</div>
          </div>
        </div>

        {/* Honors */}
        <div className="mt-2">
          <div className="text-[7px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-0.5">
            Honors &amp; Affiliations
          </div>
          <div className="text-[5.5px] italic text-slate-700">Dean&apos;s Honor List • IEEE Distributed Systems Paper Contributor</div>
        </div>
      </div>
    );
  }

  if (templateId === 'tech_minimal') {
    return (
      <div className="h-56 w-full bg-white rounded-xl border border-slate-200 p-2.5 overflow-hidden text-[6.5px] leading-tight select-none flex flex-col justify-start relative shadow-sm hover:border-[#0F9A73] transition-colors font-mono">
        {/* Minimal Monospace Header */}
        <div className="flex justify-between items-center pb-1">
          <div className="font-bold text-[8.5px] text-slate-900">alex_morgan.ts</div>
          <span className="inline-flex items-center gap-1 text-[5.5px] text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-bold">
            ● Available
          </span>
        </div>
        <div className="text-[5.5px] text-slate-500">Full-Stack Architect • alex@morgan.dev • github.com/alex</div>
        <div className="h-[1px] border-b border-dashed border-slate-300 my-1" />

        {/* Section 1 */}
        <div className="mt-1">
          <div className="font-bold text-[6.5px] text-slate-900 border-l-2 border-[#0F9A73] pl-1 mb-1">
            # EXPERIENCE
          </div>
          <div className="flex justify-between text-[6px] font-bold text-slate-800">
            <span>Nexus Cloud Systems</span>
            <span className="font-normal text-slate-500">2022–Pres</span>
          </div>
          <div className="text-[5.5px] text-slate-600 pl-1">› Senior Full-Stack Architect (Next.js, Edge, K8s)</div>
          <div className="text-[5px] text-slate-500 pl-2">› Reduced API latency by 42%; saved $180K/yr</div>

          <div className="flex justify-between text-[6px] font-bold text-slate-800 mt-1">
            <span>Vanguard Technologies</span>
            <span className="font-normal text-slate-500">2019–2021</span>
          </div>
          <div className="text-[5.5px] text-slate-600 pl-1">› Lead Engineer (React, WebSocket streaming)</div>
        </div>

        {/* Section 2 */}
        <div className="mt-2">
          <div className="font-bold text-[6.5px] text-slate-900 border-l-2 border-[#0F9A73] pl-1 mb-1">
            # TECH STACK
          </div>
          <div className="flex flex-wrap gap-1 text-[5px]">
            <span className="bg-slate-100 text-slate-800 px-1 py-0.2 rounded border border-slate-200">[TypeScript]</span>
            <span className="bg-slate-100 text-slate-800 px-1 py-0.2 rounded border border-slate-200">[Next.js]</span>
            <span className="bg-slate-100 text-slate-800 px-1 py-0.2 rounded border border-slate-200">[Go]</span>
            <span className="bg-slate-100 text-slate-800 px-1 py-0.2 rounded border border-slate-200">[Postgres]</span>
            <span className="bg-slate-100 text-slate-800 px-1 py-0.2 rounded border border-slate-200">[Docker]</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: jakes (Single Column FAANG / SWE Standard)
  return (
    <div className="h-56 w-full bg-white rounded-xl border border-slate-200 p-2.5 overflow-hidden text-[6.5px] leading-tight select-none flex flex-col justify-start relative shadow-sm hover:border-[#0F9A73] transition-colors">
      {/* Centered Header */}
      <div className="text-center pb-1">
        <div className="font-bold text-[9px] text-slate-900 tracking-wider uppercase">Debkanta Dey</div>
        <div className="text-[5.5px] text-slate-600 flex items-center justify-center gap-1 mt-0.5">
          <span>SF, CA</span>
          <span>•</span>
          <span>alex@morgan.dev</span>
          <span>•</span>
          <span>(415) 890-4211</span>
          <span>•</span>
          <span>github.com/alex</span>
        </div>
        <div className="h-[1px] bg-slate-900 w-full my-1" />
      </div>

      {/* Education */}
      <div className="mt-0.5">
        <div className="text-[7px] font-bold uppercase text-slate-900 border-b border-slate-900 pb-0.5 mb-0.5">
          Education
        </div>
        <div className="flex justify-between items-baseline font-bold text-slate-800 text-[6px]">
          <span>UC Berkeley</span>
          <span className="font-normal text-slate-500">2015 – 2019</span>
        </div>
        <div className="italic text-slate-600 text-[5.5px]">B.S. in Computer Science, Magna Cum Laude</div>
      </div>

      {/* Experience */}
      <div className="mt-1.5">
        <div className="text-[7px] font-bold uppercase text-slate-900 border-b border-slate-900 pb-0.5 mb-0.5">
          Experience
        </div>
        <div className="flex justify-between items-baseline font-bold text-slate-800 text-[6px]">
          <span>Senior Full-Stack Architect</span>
          <span className="font-normal text-slate-500">2022 – Pres</span>
        </div>
        <div className="italic text-slate-600 text-[5.5px] mb-0.5">Nexus Cloud Systems</div>
        <div className="text-[5px] text-slate-600 pl-1 space-y-0.5">
          <div>• Architected distributed microservices powering 10M+ daily events</div>
          <div>• Reduced p99 API latency by 42% via edge serverless computing</div>
        </div>

        <div className="flex justify-between items-baseline font-bold text-slate-800 text-[6px] mt-1">
          <span>Lead Software Engineer</span>
          <span className="font-normal text-slate-500">2019 – 2021</span>
        </div>
        <div className="italic text-slate-600 text-[5.5px] mb-0.5">Vanguard Financial</div>
      </div>

      {/* Skills */}
      <div className="mt-1.5">
        <div className="text-[7px] font-bold uppercase text-slate-900 border-b border-slate-900 pb-0.5 mb-0.5">
          Technical Skills
        </div>
        <div className="text-[5.5px] text-slate-700 truncate">
          <strong className="text-slate-900">Languages:</strong> TypeScript, Go, Python, SQL
        </div>
        <div className="text-[5.5px] text-slate-700 truncate">
          <strong className="text-slate-900">Frameworks:</strong> Next.js 15, React, Node.js, Tailwind
        </div>
      </div>
    </div>
  );
}

export default function AdminResumePage() {
  const [mode, setMode] = useState<ResumeMode>('latex');
  const [latexCode, setLatexCode] = useState<string>(LATEX_TEMPLATES.jakes.code);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('jakes');

  // Two-column editor division state (Page 1: Column 1, Page 2: Column 2, Full Document)
  type EditorTab = 'page1' | 'page2' | 'main';
  const [editorTab, setEditorTab] = useState<EditorTab>('main');
  const [col1Code, setCol1Code] = useState<string>('');
  const [col2Code, setCol2Code] = useState<string>('');

  // Overleaf-style UI states
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [lastCompiledAt, setLastCompiledAt] = useState<string>('Just now');
  const [showLogsDrawer, setShowLogsDrawer] = useState<boolean>(false);
  const [designModalOpen, setDesignModalOpen] = useState<boolean>(false);
  const [activeFile, setActiveFile] = useState<string>('main.tex');

  // Docs Mode state
  const [docsData, setDocsData] = useState<PortfolioResumeData>(INITIAL_PORTFOLIO_DATA);
  const [docsLayout, setDocsLayout] = useState<DocsLayout>('single');
  const [docsFont, setDocsFont] = useState<DocsFont>('Inter');
  const [docsTheme, setDocsTheme] = useState(COLOR_THEMES[0]);
  const [activeDocsTab, setActiveDocsTab] = useState<'profile' | 'experience' | 'education' | 'skills' | 'projects'>('profile');

  // Preview & Zoom controls
  const [zoomLevel, setZoomLevel] = useState<number>(75);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Check if current latex or selected template is two-column
  const extractedColumns = useMemo(() => {
    return extractTwoColumnsFromLatex(latexCode);
  }, [latexCode]);

  const isTwoColumn =
    extractedColumns.isTwoColumn ||
    LATEX_TEMPLATES[selectedTemplateId]?.category === 'two-column';

  // Active code for editor depending on selected tab
  const activeEditorCode = useMemo(() => {
    if (!isTwoColumn) return latexCode;
    if (editorTab === 'page1') return col1Code || extractedColumns.col1;
    if (editorTab === 'page2') return col2Code || extractedColumns.col2;
    return latexCode;
  }, [isTwoColumn, editorTab, col1Code, col2Code, latexCode, extractedColumns]);

  // Line count computation for Overleaf line numbers gutter
  const lineCount = useMemo(() => {
    return activeEditorCode.split('\n').length;
  }, [activeEditorCode]);

  // Active file label
  const activeFileName = useMemo(() => {
    if (!isTwoColumn) return 'main.tex';
    if (editorTab === 'page1') return 'column1.tex';
    if (editorTab === 'page2') return 'column2.tex';
    return 'main.tex';
  }, [isTwoColumn, editorTab]);

  // Load saved state or fetch from portfolio database on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('portfolio_resume_mode') as ResumeMode;
      if (savedMode) setMode(savedMode);

      const savedLatex = localStorage.getItem('portfolio_resume_latex');
      if (savedLatex) {
        setLatexCode(savedLatex);
        const ext = extractTwoColumnsFromLatex(savedLatex);
        if (ext.isTwoColumn) {
          setCol1Code(ext.col1);
          setCol2Code(ext.col2);
          setEditorTab('page1');
          setActiveFile('column1.tex');
        }
      }

      const savedDocs = localStorage.getItem('portfolio_resume_docs');
      if (savedDocs) setDocsData(JSON.parse(savedDocs));
    } catch {}

    Promise.allSettled([
      api.getProfile(),
      api.getExperiences(),
      api.getEducations(),
      api.getSkills(),
      api.getProjects(),
    ]).then(([profRes, expRes, eduRes, skillRes, projRes]) => {
      const p = profRes.status === 'fulfilled' ? profRes.value : null;
      const exp = expRes.status === 'fulfilled' ? expRes.value : [];
      const edu = eduRes.status === 'fulfilled' ? eduRes.value : [];
      const skills = skillRes.status === 'fulfilled' ? skillRes.value : [];
      const proj = projRes.status === 'fulfilled' ? projRes.value : [];

      if (p) {
        setDocsData((prev) => ({
          ...prev,
          fullName: p.fullName || prev.fullName,
          professionalTitle: p.professionalTitle || prev.professionalTitle,
          email: p.email || prev.email,
          phone: p.phone || prev.phone,
          location: p.location || prev.location,
          websiteUrl: p.websiteUrl || p.portfolioUrl || prev.websiteUrl,
          githubUrl: p.githubUrl || prev.githubUrl,
          linkedinUrl: p.linkedinUrl || prev.linkedinUrl,
          summary: p.shortBio || p.longBio || prev.summary,
          experiences:
            exp.length > 0
              ? exp.map((e: any) => ({
                  title: e.jobTitle || 'Lead Software Engineer',
                  company: e.companyName || e.company || 'Nexus Cloud Systems',
                  location: e.location || 'San Francisco, CA',
                  startDate: e.startDate ? new Date(e.startDate).getFullYear().toString() : '2022',
                  endDate: e.currentlyWorking || e.isCurrent ? 'Present' : e.endDate ? new Date(e.endDate).getFullYear().toString() : '2023',
                  current: e.currentlyWorking ?? e.isCurrent ?? false,
                  description: Array.isArray(e.responsibilities)
                    ? e.responsibilities.join('\n')
                    : typeof e.responsibilities === 'string'
                    ? e.responsibilities.replace(/\.\s+/g, '.\n')
                    : e.description || '',
                }))
              : prev.experiences,
          educations:
            edu.length > 0
              ? edu.map((ed: any) => ({
                  degree: ed.degree || 'B.S. in Computer Science',
                  institution: ed.institution || 'University of California, Berkeley',
                  fieldOfStudy: ed.fieldOfStudy || 'Computer Science',
                  startDate: ed.startDate ? new Date(ed.startDate).getFullYear().toString() : '2014',
                  endDate: ed.endDate ? new Date(ed.endDate).getFullYear().toString() : '2018',
                  grade: ed.grade || 'GPA: 3.89 / 4.00',
                }))
              : prev.educations,
          skills:
            skills.length > 0
              ? skills.map((s: any) => ({
                  name: s.name,
                  category: s.category || 'Core Technologies',
                }))
              : prev.skills,
          projects:
            proj.length > 0
              ? proj.map((pr: any) => ({
                  title: pr.title,
                  technologies: Array.isArray(pr.technologies)
                    ? pr.technologies
                    : typeof pr.technologies === 'string'
                    ? pr.technologies.split(/[\s,]+/).filter(Boolean)
                    : ['TypeScript', 'Next.js'],
                  shortDescription: pr.shortDescription || pr.fullDescription || '',
                }))
              : prev.projects,
        }));
      }
    });
  }, []);

  // Parse LaTeX in real time (returns HTML for unified preview)
  const { html: parsedLatexHtml, warnings } = useMemo(() => {
    return parseLatexToHtml(latexCode);
  }, [latexCode]);

  // Dynamic A4 Page Splitter:
  // When content fits in 1 page (<= 980px printable height) -> 1 single page sheet
  // When content extends past the page (or on \newpage) -> 2 separate sheets with extended text on Page 2
  const [resumePages, setResumePages] = useState<string[]>([]);

  useEffect(() => {
    if (parsedLatexHtml) {
      const pages = splitHtmlIntoA4Pages(parsedLatexHtml);
      setResumePages(pages);
    } else {
      setResumePages([]);
    }
  }, [parsedLatexHtml]);

  const displayPages = useMemo(() => {
    if (resumePages.length > 0) return resumePages;
    return parsedLatexHtml ? [parsedLatexHtml] : [];
  }, [resumePages, parsedLatexHtml]);

  // Overleaf-style Recompile button handler
  const handleRecompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      if (parsedLatexHtml) {
        const pages = splitHtmlIntoA4Pages(parsedLatexHtml);
        setResumePages(pages);
      }
      const now = new Date();
      setLastCompiledAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      toast.success('Document recompiled successfully!');
    }, 450);
  };

  // Keyboard shortcut Ctrl+Enter for Recompile (just like Overleaf)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRecompile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Switch editor tab with sync
  const handleSwitchEditorTab = (tab: EditorTab) => {
    const ext = extractTwoColumnsFromLatex(latexCode);
    if (ext.isTwoColumn) {
      if (editorTab === 'main' || !col1Code || !col2Code) {
        setCol1Code(ext.col1);
        setCol2Code(ext.col2);
      }
    }
    setEditorTab(tab);
    if (tab === 'page1') setActiveFile('column1.tex');
    else if (tab === 'page2') setActiveFile('column2.tex');
    else setActiveFile('main.tex');
  };

  // Editor content change handler with real-time bidirectional synchronization
  const handleEditorChange = (newVal: string) => {
    if (!isTwoColumn || editorTab === 'main') {
      setLatexCode(newVal);
      const ext = extractTwoColumnsFromLatex(newVal);
      if (ext.isTwoColumn) {
        setCol1Code(ext.col1);
        setCol2Code(ext.col2);
      }
      return;
    }

    if (editorTab === 'page1') {
      setCol1Code(newVal);
      const ext = extractTwoColumnsFromLatex(latexCode);
      if (ext.isTwoColumn) {
        const updated = assembleTwoColumnLatex(
          ext.header,
          newVal,
          col2Code || ext.col2,
          ext.footer,
          ext.width1,
          ext.width2
        );
        setLatexCode(updated);
      }
    } else if (editorTab === 'page2') {
      setCol2Code(newVal);
      const ext = extractTwoColumnsFromLatex(latexCode);
      if (ext.isTwoColumn) {
        const updated = assembleTwoColumnLatex(
          ext.header,
          col1Code || ext.col1,
          newVal,
          ext.footer,
          ext.width1,
          ext.width2
        );
        setLatexCode(updated);
      }
    }
  };

  // Save current state to local storage
  const handleSaveDraft = () => {
    try {
      localStorage.setItem('portfolio_resume_mode', mode);
      localStorage.setItem('portfolio_resume_latex', latexCode);
      localStorage.setItem('portfolio_resume_docs', JSON.stringify(docsData));
      toast.success('Resume draft saved successfully!');
    } catch {
      toast.error('Failed to save to local storage');
    }
  };

  // Switch LaTeX template / design
  const handleSelectTemplate = (templateKey: string) => {
    const tmpl = LATEX_TEMPLATES[templateKey];
    if (tmpl) {
      setSelectedTemplateId(templateKey);
      setLatexCode(tmpl.code);
      if (tmpl.category === 'two-column') {
        const ext = extractTwoColumnsFromLatex(tmpl.code);
        setCol1Code(tmpl.col1Code || ext.col1);
        setCol2Code(tmpl.col2Code || ext.col2);
        setEditorTab('page1');
        setActiveFile('column1.tex');
      } else {
        setEditorTab('main');
        setActiveFile('main.tex');
      }
      setDesignModalOpen(false);
      handleRecompile();
      toast.info(`Loaded "${tmpl.name}" design!`);
    }
  };

  // Generate LaTeX from real portfolio data according to chosen layout
  const handleGenerateFromPortfolio = (layoutChoice: 'single' | 'two-column') => {
    const generated = generateLatexFromPortfolio(docsData, layoutChoice);
    setLatexCode(generated);
    if (layoutChoice === 'two-column') {
      const ext = extractTwoColumnsFromLatex(generated);
      setCol1Code(ext.col1);
      setCol2Code(ext.col2);
      setEditorTab('page1');
      setActiveFile('column1.tex');
    } else {
      setEditorTab('main');
      setActiveFile('main.tex');
    }
    setDesignModalOpen(false);
    handleRecompile();
    toast.success(`Generated fresh ${layoutChoice === 'two-column' ? 'Two-Column' : 'Single-Column'} LaTeX from portfolio data!`);
  };

  // Copy LaTeX code to clipboard
  const handleCopyLatex = () => {
    navigator.clipboard.writeText(activeEditorCode);
    setCopiedCode(true);
    toast.success(
      isTwoColumn && editorTab === 'page1'
        ? 'column1.tex LaTeX copied!'
        : isTwoColumn && editorTab === 'page2'
        ? 'column2.tex LaTeX copied!'
        : 'Full LaTeX code copied to clipboard!'
    );
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Quick LaTeX snippet insertion
  const handleInsertSnippet = (snippet: string) => {
    if (!isTwoColumn || editorTab === 'main') {
      const nextCode = latexCode + '\n' + snippet;
      setLatexCode(nextCode);
      const ext = extractTwoColumnsFromLatex(nextCode);
      if (ext.isTwoColumn) {
        setCol1Code(ext.col1);
        setCol2Code(ext.col2);
      }
    } else if (editorTab === 'page1') {
      const nextCol1 = (col1Code || extractedColumns.col1) + '\n' + snippet;
      setCol1Code(nextCol1);
      const ext = extractTwoColumnsFromLatex(latexCode);
      if (ext.isTwoColumn) {
        const updated = assembleTwoColumnLatex(
          ext.header,
          nextCol1,
          col2Code || ext.col2,
          ext.footer,
          ext.width1,
          ext.width2
        );
        setLatexCode(updated);
      }
    } else if (editorTab === 'page2') {
      const nextCol2 = (col2Code || extractedColumns.col2) + '\n' + snippet;
      setCol2Code(nextCol2);
      const ext = extractTwoColumnsFromLatex(latexCode);
      if (ext.isTwoColumn) {
        const updated = assembleTwoColumnLatex(
          ext.header,
          col1Code || ext.col1,
          nextCol2,
          ext.footer,
          ext.width1,
          ext.width2
        );
        setLatexCode(updated);
      }
    }
    handleRecompile();
    toast.info('Snippet inserted into active code editor');
  };

  // Export handlers
  const handleExportPdf = async () => {
    setIsExporting(true);
    setExportDropdownOpen(false);
    try {
      const targetId = mode === 'latex' ? 'latex-resume-canvas' : 'docs-resume-canvas';
      await exportResumeAsPdf(targetId, `${docsData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      toast.success(
        mode === 'latex' && displayPages.length > 1
          ? 'PDF exported as 2-page document with extended text on Page 2!'
          : 'PDF exported successfully!'
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDocx = () => {
    setExportDropdownOpen(false);
    try {
      const currentDocLayout = mode === 'docs' ? docsLayout : LATEX_TEMPLATES[selectedTemplateId]?.category || 'single';
      exportResumeAsDocx(docsData, `${docsData.fullName.replace(/\s+/g, '_')}_Resume`, currentDocLayout);
      toast.success(`Microsoft Word (${currentDocLayout === 'two-column' ? '2-Column' : 'Single Column'}) file downloaded!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to export Word document');
    }
  };

  const handleExportImage = async (format: 'png' | 'jpeg') => {
    setIsExporting(true);
    setExportDropdownOpen(false);
    try {
      const targetId = mode === 'latex' ? 'latex-resume-canvas' : 'docs-resume-canvas';
      await exportResumeAsImage(targetId, `${docsData.fullName.replace(/\s+/g, '_')}_Resume`, format);
      toast.success(`Exported single-file ${format.toUpperCase()}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to export image');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTex = (fileType: 'col1' | 'col2' | 'main') => {
    setExportDropdownOpen(false);
    if (fileType === 'col1') {
      exportLatexFile(col1Code || extractedColumns.col1, 'column1.tex');
      toast.success('Downloaded column1.tex (Column 1 file)!');
    } else if (fileType === 'col2') {
      exportLatexFile(col2Code || extractedColumns.col2, 'column2.tex');
      toast.success('Downloaded column2.tex (Column 2 file)!');
    } else {
      exportLatexFile(latexCode, 'main.tex');
      toast.success('Downloaded main.tex (Unified document)!');
    }
  };

  const handleTriggerPrint = () => {
    setExportDropdownOpen(false);
    try {
      const targetId = mode === 'latex' ? 'latex-resume-canvas' : 'docs-resume-canvas';
      const docTitle = `${(docsData.fullName || 'Resume').replace(/\s+/g, '_')}_Resume`;
      printResumeElement(targetId, docTitle);
      toast.success('Opening system print dialog for resume preview...');
    } catch (err: any) {
      toast.error(err.message || 'Failed to open print dialog');
    }
  };

  // Keyboard shortcut: Ctrl+P / Cmd+P prints only the resume preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleTriggerPrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, docsData]);

  return (
    <div className="space-y-4 pb-20 w-full text-slate-800">
      {/* ========================================================================= */}
      {/* 1. OVERLEAF TOP NAV / CHROME BAR */}
      {/* ========================================================================= */}
      <div className="bg-[#1e293b] text-white rounded-2xl px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 border border-slate-700">
        {/* Left: Overleaf Branding & File Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-300 transition-colors"
            title={sidebarOpen ? 'Collapse Project Tree' : 'Expand Project Tree'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
            <div className="w-6 h-6 rounded-md bg-[#0F9A73] flex items-center justify-center font-bold text-xs text-white shadow-sm">
              OL
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                Resume Studio
                <span className="text-[10px] font-mono text-[#0F9A73] bg-[#0F9A73]/20 px-1.5 py-0.2 rounded font-semibold">
                  Overleaf Engine
                </span>
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
            <button
              onClick={() => setMode('latex')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                mode === 'latex' ? 'bg-[#0F9A73] text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>LaTeX Code</span>
            </button>
            <button
              onClick={() => setMode('docs')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                mode === 'docs' ? 'bg-[#0F9A73] text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Docs Editor</span>
            </button>
          </div>
        </div>

        {/* Center / Action Bar: Overleaf Green "Recompile" Button */}
        <div className="flex items-center gap-2">
          {mode === 'latex' && (
            <button
              onClick={handleRecompile}
              disabled={isCompiling}
              className="flex items-center gap-1.5 bg-[#0F9A73] hover:bg-[#12b88a] active:scale-95 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md"
              title="Recompile LaTeX (Ctrl+Enter)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
              <span>{isCompiling ? 'Compiling...' : 'Recompile'}</span>
              <kbd className="hidden md:inline-block text-[9px] bg-emerald-800/60 px-1 py-0.2 rounded text-emerald-100 font-mono ml-1">
                Ctrl+Enter
              </kbd>
            </button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDesignModalOpen(true)}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white text-xs"
          >
            <Palette className="w-3.5 h-3.5 mr-1 text-[#0F9A73]" />
            <span>Design Gallery</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            <span>Save Draft</span>
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-50 space-y-1 text-slate-900">
                <button
                  onClick={handleExportPdf}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0F9A73] rounded-xl transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <div>
                    <div className="font-bold">PDF Document (.pdf)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Single-page print-ready vector PDF</div>
                  </div>
                </button>

                <button
                  onClick={handleExportDocx}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0F9A73] rounded-xl transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold">Microsoft Word (.doc)</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {mode === 'docs'
                        ? docsLayout === 'two-column'
                          ? '2-Column Table Format'
                          : 'Standard Linear Format'
                        : 'Single / 2-Col Word Format'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportImage('png')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0F9A73] rounded-xl transition-colors text-left"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-bold">High-Res Image (.png)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Single-file 300 DPI image</div>
                  </div>
                </button>

                {mode === 'latex' && (
                  <>
                    <div className="h-px bg-slate-200 my-1" />
                    <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      LaTeX Source Files
                    </div>

                    {isTwoColumn ? (
                      <>
                        <button
                          onClick={() => handleDownloadTex('col1')}
                          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#0F9A73] rounded-xl transition-colors text-left"
                        >
                          <FileCode className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="font-bold">column1.tex (Column 1)</div>
                            <div className="text-[10px] text-slate-500 font-normal">Page 1 LaTeX code file</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleDownloadTex('col2')}
                          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#0F9A73] rounded-xl transition-colors text-left"
                        >
                          <FileCode className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="font-bold">column2.tex (Column 2)</div>
                            <div className="text-[10px] text-slate-500 font-normal">Page 2 LaTeX code file</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleDownloadTex('main')}
                          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#0F9A73] rounded-xl transition-colors text-left"
                        >
                          <Layers className="w-4 h-4 text-slate-600" />
                          <div>
                            <div className="font-bold">main.tex (Combined)</div>
                            <div className="text-[10px] text-slate-500 font-normal">Unified full document</div>
                          </div>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDownloadTex('main')}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#0F9A73] rounded-xl transition-colors text-left"
                      >
                        <FileCode className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-bold">main.tex (LaTeX Code)</div>
                          <div className="text-[10px] text-slate-500 font-normal">Single-file LaTeX document</div>
                        </div>
                      </button>
                    )}
                  </>
                )}

                <div className="h-px bg-slate-200 my-1" />

                <button
                  onClick={handleTriggerPrint}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0F9A73] rounded-xl transition-colors text-left"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-bold">System Print Dialog</div>
                    <div className="text-[10px] text-slate-500 font-normal">Native vector browser print</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESIGN GALLERY MODAL (Single Column & Two Column library) */}
      {/* ========================================================================= */}
      {designModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#0F9A73]" />
                  <span>Resume Design Gallery</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a single-column or two-column resume design. Inspect the live UI layout structure below before applying.
                </p>
              </div>
              <button
                onClick={() => setDesignModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Cards */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f8fafd] border border-blue-100 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Instant Portfolio Sync</span>
                  <span className="text-[11px] text-slate-600">Populate your resume with current database experiences &amp; skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerateFromPortfolio('single')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-black transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Sync as Single Column</span>
                  </button>
                  <button
                    onClick={() => handleGenerateFromPortfolio('two-column')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F9A73] text-white text-xs font-semibold hover:bg-[#12b88a] transition-colors"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Sync as Two Column</span>
                  </button>
                </div>
              </div>

              {/* Template Cards Grid with Visual UI Structure Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.values(LATEX_TEMPLATES).map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      selectedTemplateId === tmpl.id
                        ? 'border-[#0F9A73] bg-emerald-50/20 shadow-md ring-2 ring-[#0F9A73]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {tmpl.badge}
                        </span>
                        {tmpl.category === 'two-column' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold font-mono">
                            <Columns className="w-3 h-3" /> 2-Page Column Split
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-semibold font-mono">
                            <Square className="w-3 h-3" /> Single Column
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{tmpl.name}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{tmpl.description}</p>

                      {/* Visual Resume UI Structure Skeleton */}
                      <div className="pt-2">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono flex items-center justify-between">
                          <span>UI Structure Layout</span>
                          <span className="text-[9px] text-[#0F9A73] font-bold">1:1 Miniature</span>
                        </div>
                        <ResumeTemplateThumbnail templateId={tmpl.id} />
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleSelectTemplate(tmpl.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedTemplateId === tmpl.id
                            ? 'bg-[#0F9A73] text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {selectedTemplateId === tmpl.id ? 'Active' : 'Load Template'}
                      </button>

                      <button
                        onClick={() => handleGenerateFromPortfolio(tmpl.category)}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                      >
                        Apply with My Data →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE (OVERLEAF SPLIT VIEW) */}
      {/* ========================================================================= */}
      {mode === 'latex' ? (
        <div className="flex items-start gap-4">
          {/* Overleaf Project Sidebar */}
          {sidebarOpen && (
            <div className="w-60 shrink-0 bg-slate-900 text-slate-300 rounded-2xl p-4 border border-slate-800 space-y-5 hidden md:block">
              {/* File Tree */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2 font-mono">
                  Project Files
                </span>
                <div className="space-y-1 text-xs font-mono">
                  {isTwoColumn ? (
                    <>
                      <div
                        onClick={() => handleSwitchEditorTab('page1')}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          editorTab === 'page1'
                            ? 'bg-[#0F9A73]/25 text-[#0F9A73] font-bold border border-[#0F9A73]/50'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                        title="Edit Column 1 in column1.tex (Left Sidebar)"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">column1.tex</span>
                        </div>
                        <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded border border-emerald-800 font-mono shrink-0 ml-1">
                          Col 1
                        </span>
                      </div>

                      <div
                        onClick={() => handleSwitchEditorTab('page2')}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          editorTab === 'page2'
                            ? 'bg-[#0F9A73]/25 text-[#0F9A73] font-bold border border-[#0F9A73]/50'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                        title="Edit Column 2 in column2.tex (Right Content)"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">column2.tex</span>
                        </div>
                        <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded border border-emerald-800 font-mono shrink-0 ml-1">
                          Col 2
                        </span>
                      </div>

                      <div
                        onClick={() => handleSwitchEditorTab('main')}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          editorTab === 'main'
                            ? 'bg-slate-800 text-white font-bold border border-slate-700'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                        title="Edit Full Combined LaTeX Document"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Layers className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">main.tex</span>
                        </div>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-mono shrink-0 ml-1">
                          Full
                        </span>
                      </div>
                    </>
                  ) : (
                    <div
                      onClick={() => handleSwitchEditorTab('main')}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        editorTab === 'main'
                          ? 'bg-[#0F9A73]/20 text-[#0F9A73] font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>main.tex</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer">
                    <FileText className="w-3.5 h-3.5" />
                    <span>styles.cls</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer">
                    <Layers className="w-3.5 h-3.5" />
                    <span>portfolio.json</span>
                  </div>
                </div>
              </div>

              {/* Design Presets Quick Switch */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2 font-mono">
                  Template Styles
                </span>
                <div className="space-y-1 text-xs">
                  {Object.values(LATEX_TEMPLATES).map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                        selectedTemplateId === tmpl.id
                          ? 'bg-slate-800 text-[#0F9A73] font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="truncate">{tmpl.name.split('(')[0]}</span>
                      {tmpl.category === 'two-column' ? (
                        <span className="text-[9px] bg-blue-900/60 text-blue-300 px-1 py-0.2 rounded font-mono shrink-0 ml-1">
                          2-File Col
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-mono shrink-0 ml-1">
                          1-Col
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Outline */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2 font-mono">
                  Outline
                </span>
                <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                  <div className="hover:text-white cursor-pointer px-1 py-0.5">• Heading &amp; Contact</div>
                  <div className="hover:text-white cursor-pointer px-1 py-0.5">• Education</div>
                  <div className="hover:text-white cursor-pointer px-1 py-0.5">• Experience</div>
                  <div className="hover:text-white cursor-pointer px-1 py-0.5">• Projects</div>
                  <div className="hover:text-white cursor-pointer px-1 py-0.5">• Technical Skills</div>
                </div>
              </div>
            </div>
          )}

          {/* Central: LaTeX Editor */}
          <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-lg">
            {/* Editor Toolbar with Two-Column Page Switcher */}
            <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              {/* Left Side: File / Page Tabs */}
              <div className="flex items-center gap-2">
                {isTwoColumn ? (
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleSwitchEditorTab('page1')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        editorTab === 'page1'
                          ? 'bg-[#0F9A73] text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title="Edit Column 1 in column1.tex (Left Sidebar: Contact, Education, Skills)"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>column1.tex (Col 1)</span>
                    </button>

                    <button
                      onClick={() => handleSwitchEditorTab('page2')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        editorTab === 'page2'
                          ? 'bg-[#0F9A73] text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title="Edit Column 2 in column2.tex (Right Content: Experience, Projects)"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>column2.tex (Col 2)</span>
                    </button>

                    <button
                      onClick={() => handleSwitchEditorTab('main')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        editorTab === 'main'
                          ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title="View & Edit Full Unified LaTeX Document"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">main.tex (Unified)</span>
                      <span className="sm:hidden">main.tex</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <FileCode className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span className="font-bold text-white">main.tex</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      Single Column
                    </span>
                  </div>
                )}

                <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-400 border-l border-slate-800 pl-2">
                  <span className="text-white font-semibold text-[11px]">{activeFileName}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-[11px]">{lineCount} lines</span>
                </div>
              </div>

              {/* Right Side: Snippets & Copy */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                <button
                  onClick={() => handleInsertSnippet('\\section{New Section}\n\\begin{itemize}\n  \\item Detail or achievement\n\\end{itemize}')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-[#0F9A73] text-slate-300 hover:text-white transition-colors"
                >
                  + Section
                </button>
                <button
                  onClick={() => handleInsertSnippet('\\textbf{Role Title} \\hfill 2023 -- Present \\\\\n\\textit{Company Name} \\hfill San Francisco, CA\n\\begin{itemize}\n  \\item Quantifiable accomplishment.\n\\end{itemize}')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-[#0F9A73] text-slate-300 hover:text-white transition-colors"
                >
                  + Job
                </button>
                <button
                  onClick={() => handleInsertSnippet('\\item Quantified milestone delivering positive engineering outcome.')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-[#0F9A73] text-slate-300 hover:text-white transition-colors"
                >
                  + Bullet
                </button>
                <button
                  onClick={handleCopyLatex}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
                  title="Copy LaTeX"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400 inline" /> : <Copy className="w-3 h-3 inline" />}
                </button>
              </div>
            </div>

            {/* Sub-header Context Banner for Two-Column Page Division */}
            {isTwoColumn && (
              <div className="bg-emerald-950/40 border-b border-emerald-900/50 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="w-3 h-3 text-[#0F9A73] shrink-0" />
                  <span>
                    {editorTab === 'page1'
                      ? 'Editing Separate File: column1.tex (Column 1 — Left Sidebar)'
                      : editorTab === 'page2'
                      ? 'Editing Separate File: column2.tex (Column 2 — Right Content)'
                      : 'Editing Unified Master File: main.tex (Two-Column Assembled)'}
                  </span>
                </div>
                <span className="text-emerald-400/80 bg-emerald-900/40 px-2 py-0.5 rounded text-[10px] hidden sm:inline">
                  Synchronized with Single-File Preview
                </span>
              </div>
            )}

            {/* Code Body with Line Gutter */}
            <div className="flex font-mono text-xs leading-relaxed overflow-hidden h-[750px]">
              {/* Line Numbers Gutter */}
              <div className="w-11 shrink-0 bg-slate-900/80 text-slate-600 select-none text-right pr-2 pt-4 border-r border-slate-800/80 font-mono text-[11px] overflow-hidden">
                {Array.from({ length: Math.min(lineCount, 120) }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={activeEditorCode}
                onChange={(e) => handleEditorChange(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-slate-950 text-slate-100 p-4 outline-none resize-none font-mono text-xs leading-relaxed selection:bg-[#0F9A73] selection:text-white [tab-size:2] overflow-y-auto"
              />
            </div>

            {/* Overleaf Logs & Output Footer */}
            <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLogsDrawer(!showLogsDrawer)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9A73]" />
                  <span>0 Errors, 0 Warnings</span>
                </button>
                <span className="text-slate-600">|</span>
                <span className="text-[11px]">Last compiled: {lastCompiledAt}</span>
              </div>
              <span className="text-[11px] text-[#0F9A73] font-semibold">Overleaf Sync Active</span>
            </div>
          </div>

          {/* Right: Overleaf PDF Viewer */}
          <div className="flex-1 bg-[#525659] rounded-2xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl">
            {/* Overleaf PDF Viewer Toolbar */}
            <div className="bg-[#323639] text-white px-4 py-2 border-b border-black/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-300 text-[11px]">PDF Preview</span>
                <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 font-bold">
                  {displayPages.length > 1 ? '2 Pages (Page 1 & Extended Page 2)' : '1 Page (Single-Sheet A4)'}
                </span>
                {isTwoColumn && (
                  <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded font-mono hidden sm:inline-block">
                    Two-Column Layout (Side-by-Side)
                  </span>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 10, 40))}
                  className="p-1 hover:text-[#0F9A73] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 text-[11px] font-semibold text-slate-200">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                  className="p-1 hover:text-[#0F9A73] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(75)}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                    zoomLevel === 75 ? 'bg-[#0F9A73] text-white font-bold' : 'bg-black/30 hover:bg-black/50 text-slate-300'
                  }`}
                  title="Fit Width"
                >
                  Fit
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                    zoomLevel === 100 ? 'bg-[#0F9A73] text-white font-bold' : 'bg-black/30 hover:bg-black/50 text-slate-300'
                  }`}
                  title="100% standard scale"
                >
                  100%
                </button>
              </div>

              {/* Quick Actions: PDF and System Print */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="flex items-center gap-1 bg-[#0F9A73] hover:bg-[#12b88a] text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
                  title="Download PDF Document"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleTriggerPrint}
                  className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
                  title="Print Resume Preview (System Print Dialog)"
                >
                  <Printer className="w-3 h-3 text-slate-300" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>

            {/* Overleaf Gray Canvas with White Document Sheet */}
            <div className="p-4 sm:p-6 overflow-auto max-h-[780px] w-full flex justify-center bg-[#525659] relative">
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  marginBottom: `${Math.max(0, (zoomLevel / 100 - 1) * (displayPages.length * 1120 + (displayPages.length - 1) * 32))}px`,
                }}
                className="transition-transform duration-150 shrink-0"
              >
                <div id="latex-resume-canvas" className="flex flex-col items-center select-text space-y-8">
                  {displayPages.map((pageHtml, pIdx) => (
                    <div
                      key={pIdx}
                      className="resume-page w-[210mm] max-w-full min-h-[297mm] bg-white text-slate-900 px-[10mm] py-[9mm] shadow-2xl rounded-sm border border-slate-300 font-serif leading-normal box-border overflow-hidden relative select-text"
                      style={{
                        fontFamily:
                          "'Latin Modern Roman', 'Computer Modern', 'Times New Roman', Times, Georgia, serif",
                        WebkitFontSmoothing: 'antialiased',
                        textRendering: 'optimizeLegibility',
                      }}
                    >
                      {displayPages.length > 1 && (
                        <div className="page-indicator-badge absolute top-2 right-3 bg-slate-900/85 text-white text-[10px] font-mono px-2 py-0.5 rounded-full select-none shadow border border-slate-700">
                          Page {pIdx + 1} of {displayPages.length} {pIdx === 1 ? '(Extended Content)' : ''}
                        </div>
                      )}
                      <div
                        dangerouslySetInnerHTML={{ __html: pageHtml }}
                        className="latex-preview-content text-slate-900 break-words w-full max-w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 4. DOCS MODE (VISUAL DOCUMENT EDITOR WITH 1-COL & 2-COL TOGGLE) */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Docs Top Style Ribbon */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                  <Sliders className="w-4 h-4 text-[#0F9A73]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Docs Styling &amp; Layout Engine</h3>
                  <p className="text-[11px] text-slate-500">Design your resume in Single Column or Two Column layout</p>
                </div>
              </div>

              {/* Column Layout Switcher (Single Column vs Two Column) */}
              <div className="flex items-center gap-2 bg-[#f0f4fc] p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setDocsLayout('single')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    docsLayout === 'single'
                      ? 'bg-[#00007B] text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Single Column</span>
                </button>

                <button
                  onClick={() => setDocsLayout('two-column')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    docsLayout === 'two-column'
                      ? 'bg-[#00007B] text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Two Column</span>
                </button>
              </div>

              {/* Font & Palette */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500">Font:</span>
                  <select
                    value={docsFont}
                    onChange={(e) => setDocsFont(e.target.value as DocsFont)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium"
                  >
                    <option value="Inter">Modern Sans (Inter)</option>
                    <option value="Merriweather">Classic Serif (Merriweather)</option>
                    <option value="Space Grotesk">Tech Geometric (Space Grotesk)</option>
                    <option value="Roboto">Clean Sans (Roboto)</option>
                    <option value="JetBrains Mono">Monospace (JetBrains)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500">Palette:</span>
                  <div className="flex items-center gap-1">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setDocsTheme(theme)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform ${
                          docsTheme.id === theme.id ? 'scale-125 border-black shadow' : 'border-white'
                        }`}
                        style={{ backgroundColor: theme.primary }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-navigation for Docs fields */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveDocsTab('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeDocsTab === 'profile'
                    ? 'bg-[#00007B] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Identity &amp; Summary</span>
              </button>
              <button
                onClick={() => setActiveDocsTab('experience')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeDocsTab === 'experience'
                    ? 'bg-[#00007B] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Experience ({docsData.experiences.length})</span>
              </button>
              <button
                onClick={() => setActiveDocsTab('education')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeDocsTab === 'education'
                    ? 'bg-[#00007B] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education ({docsData.educations.length})</span>
              </button>
              <button
                onClick={() => setActiveDocsTab('skills')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeDocsTab === 'skills'
                    ? 'bg-[#00007B] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Skills ({docsData.skills.length})</span>
              </button>
              <button
                onClick={() => setActiveDocsTab('projects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeDocsTab === 'projects'
                    ? 'bg-[#00007B] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({docsData.projects.length})</span>
              </button>
            </div>
          </div>

          {/* Split Docs Content: Form Editor on Left, Live Paper Canvas on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Section */}
            <div className="lg:col-span-5 space-y-4">
              {/* TAB 1: Profile & Summary */}
              {activeDocsTab === 'profile' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Personal Identity &amp; Contact
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={docsData.fullName}
                        onChange={(e) => setDocsData({ ...docsData, fullName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={docsData.professionalTitle}
                        onChange={(e) => setDocsData({ ...docsData, professionalTitle: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1">Email</label>
                        <input
                          type="email"
                          value={docsData.email}
                          onChange={(e) => setDocsData({ ...docsData, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1">Phone</label>
                        <input
                          type="text"
                          value={docsData.phone}
                          onChange={(e) => setDocsData({ ...docsData, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">Location</label>
                      <input
                        type="text"
                        value={docsData.location}
                        onChange={(e) => setDocsData({ ...docsData, location: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">Professional Summary</label>
                      <textarea
                        rows={4}
                        value={docsData.summary || ''}
                        onChange={(e) => setDocsData({ ...docsData, summary: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Work Experience */}
              {activeDocsTab === 'experience' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-bold text-slate-900">Work Experience</h4>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setDocsData({
                          ...docsData,
                          experiences: [
                            {
                              title: 'Software Engineer',
                              company: 'Tech Corp',
                              location: 'San Francisco, CA',
                              startDate: '2023',
                              endDate: 'Present',
                              current: true,
                              description: 'Built high-impact services with modern tech stack.',
                            },
                            ...docsData.experiences,
                          ],
                        })
                      }
                      className="text-xs bg-[#0F9A73]/15 text-[#0F9A73] hover:bg-[#0F9A73] hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add Job</span>
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {docsData.experiences.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                        <button
                          onClick={() => {
                            const updated = docsData.experiences.filter((_, i) => i !== idx);
                            setDocsData({ ...docsData, experiences: updated });
                          }}
                          className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Job Title</label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => {
                                const copy = [...docsData.experiences];
                                copy[idx].title = e.target.value;
                                setDocsData({ ...docsData, experiences: copy });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const copy = [...docsData.experiences];
                                copy[idx].company = e.target.value;
                                setDocsData({ ...docsData, experiences: copy });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Dates</label>
                            <input
                              type="text"
                              value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'Present'}`}
                              onChange={(e) => {
                                const copy = [...docsData.experiences];
                                const parts = e.target.value.split('-');
                                copy[idx].startDate = (parts[0] || '').trim();
                                copy[idx].endDate = (parts[1] || '').trim();
                                setDocsData({ ...docsData, experiences: copy });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Location</label>
                            <input
                              type="text"
                              value={exp.location || ''}
                              onChange={(e) => {
                                const copy = [...docsData.experiences];
                                copy[idx].location = e.target.value;
                                setDocsData({ ...docsData, experiences: copy });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Bullets (one per line)</label>
                          <textarea
                            rows={3}
                            value={exp.description || ''}
                            onChange={(e) => {
                              const copy = [...docsData.experiences];
                              copy[idx].description = e.target.value;
                              setDocsData({ ...docsData, experiences: copy });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Education */}
              {activeDocsTab === 'education' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-bold text-slate-900">Education Credentials</h4>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setDocsData({
                          ...docsData,
                          educations: [
                            {
                              degree: 'B.S. in Computer Science',
                              institution: 'University Name',
                              startDate: '2016',
                              endDate: '2020',
                              grade: 'Honors',
                            },
                            ...docsData.educations,
                          ],
                        })
                      }
                      className="text-xs bg-[#0F9A73]/15 text-[#0F9A73] hover:bg-[#0F9A73] hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add Degree</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {docsData.educations.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                        <button
                          onClick={() => {
                            const updated = docsData.educations.filter((_, i) => i !== idx);
                            setDocsData({ ...docsData, educations: updated });
                          }}
                          className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Degree &amp; Major</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const copy = [...docsData.educations];
                              copy[idx].degree = e.target.value;
                              setDocsData({ ...docsData, educations: copy });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const copy = [...docsData.educations];
                              copy[idx].institution = e.target.value;
                              setDocsData({ ...docsData, educations: copy });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Graduation Year</label>
                            <input
                              type="text"
                              value={edu.endDate || ''}
                              onChange={(e) => {
                                const copy = [...docsData.educations];
                                copy[idx].endDate = e.target.value;
                                setDocsData({ ...docsData, educations: copy });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">GPA / Honors</label>
                            <input
                              type="text"
                              value={edu.grade || ''}
                              onChange={(e) => {
                                const copy = [...docsData.educations];
                                copy[idx].grade = e.target.value;
                                setDocsData({ ...docsData, educations: copy });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Skills */}
              {activeDocsTab === 'skills' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-bold text-slate-900">Technical Skills</h4>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setDocsData({
                          ...docsData,
                          skills: [...docsData.skills, { name: 'GraphQL', category: 'Frameworks' }],
                        })
                      }
                      className="text-xs bg-[#0F9A73]/15 text-[#0F9A73] hover:bg-[#0F9A73] hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add Skill</span>
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                    {docsData.skills.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <input
                          type="text"
                          value={s.name}
                          onChange={(e) => {
                            const copy = [...docsData.skills];
                            copy[idx].name = e.target.value;
                            setDocsData({ ...docsData, skills: copy });
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800"
                          placeholder="Skill name"
                        />
                        <input
                          type="text"
                          value={s.category}
                          onChange={(e) => {
                            const copy = [...docsData.skills];
                            copy[idx].category = e.target.value;
                            setDocsData({ ...docsData, skills: copy });
                          }}
                          className="w-32 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600"
                          placeholder="Category"
                        />
                        <button
                          onClick={() => {
                            const updated = docsData.skills.filter((_, i) => i !== idx);
                            setDocsData({ ...docsData, skills: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Projects */}
              {activeDocsTab === 'projects' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-bold text-slate-900">Featured Projects</h4>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setDocsData({
                          ...docsData,
                          projects: [
                            {
                              title: 'New Cloud Project',
                              technologies: ['TypeScript', 'Next.js', 'PostgreSQL'],
                              shortDescription: 'High-performance cloud application.',
                            },
                            ...docsData.projects,
                          ],
                        })
                      }
                      className="text-xs bg-[#0F9A73]/15 text-[#0F9A73] hover:bg-[#0F9A73] hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add Project</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {docsData.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                        <button
                          onClick={() => {
                            const updated = docsData.projects.filter((_, i) => i !== idx);
                            setDocsData({ ...docsData, projects: updated });
                          }}
                          className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const copy = [...docsData.projects];
                              copy[idx].title = e.target.value;
                              setDocsData({ ...docsData, projects: copy });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Technologies (comma separated)</label>
                          <input
                            type="text"
                            value={(proj.technologies || []).join(', ')}
                            onChange={(e) => {
                              const copy = [...docsData.projects];
                              copy[idx].technologies = e.target.value.split(',').map((t) => t.trim());
                              setDocsData({ ...docsData, projects: copy });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Description</label>
                          <textarea
                            rows={2}
                            value={proj.shortDescription || ''}
                            onChange={(e) => {
                              const copy = [...docsData.projects];
                              copy[idx].shortDescription = e.target.value;
                              setDocsData({ ...docsData, projects: copy });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Docs Canvas Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#525659] rounded-2xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl">
                <div className="bg-[#323639] text-white px-4 py-2 border-b border-black/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#0F9A73]" />
                    <span className="font-mono text-slate-300">
                      Docs Preview ({docsLayout === 'two-column' ? '2-Column Split' : 'Single Column'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-black/30 px-2 py-0.5 rounded">
                      A4 Paper Sheet
                    </span>
                    <button
                      onClick={handleTriggerPrint}
                      title="Print Resume Preview (System Print Dialog)"
                      className="flex items-center gap-1 bg-[#0F9A73] hover:bg-[#12b88a] text-white px-2 py-0.5 rounded text-xs font-bold transition-all shadow-sm"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Scaled Preview Canvas */}
                <div className="p-6 overflow-y-auto max-h-[750px] flex justify-center bg-[#525659]">
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="transition-transform duration-150"
                  >
                    {/* Rendered Document */}
                    <div
                      id="docs-resume-canvas"
                      className="resume-page w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[10mm] sm:p-[12mm] shadow-2xl rounded-sm border border-slate-300 space-y-5 relative box-border"
                      style={{
                        fontFamily:
                          docsFont === 'Merriweather'
                            ? "'Merriweather', serif"
                            : docsFont === 'Space Grotesk'
                            ? "'Space Grotesk', sans-serif"
                            : docsFont === 'JetBrains Mono'
                            ? "'JetBrains Mono', monospace"
                            : "'Inter', sans-serif",
                      }}
                    >
                      {/* Top Header */}
                      <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                        <h1
                          className="text-3xl font-extrabold tracking-tight"
                          style={{ color: docsTheme.primary }}
                        >
                          {docsData.fullName}
                        </h1>
                        <p
                          className="text-sm font-semibold tracking-wide"
                          style={{ color: docsTheme.accent }}
                        >
                          {docsData.professionalTitle}
                        </p>
                        <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600 font-medium">
                          <span>{docsData.phone}</span>
                          <span>•</span>
                          <span>{docsData.email}</span>
                          <span>•</span>
                          <span>{docsData.location}</span>
                          {docsData.websiteUrl && (
                            <>
                              <span>•</span>
                              <span>{docsData.websiteUrl.replace(/^https?:\/\//, '')}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* CONDITIONAL LAYOUT: TWO-COLUMN VS SINGLE COLUMN */}
                      {docsLayout === 'two-column' ? (
                        <div className="flex gap-6 items-start justify-between w-full">
                          {/* Left Column (33%): Contact, Summary, Skills, Education */}
                          <div className="w-[33%] shrink-0 space-y-4 border-r border-slate-200 pr-4">
                            {docsData.summary && (
                              <div>
                                <h3
                                  className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5"
                                  style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                                >
                                  Profile
                                </h3>
                                <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                                  {docsData.summary}
                                </p>
                              </div>
                            )}

                            {/* Skills Sidebar */}
                            {docsData.skills.length > 0 && (
                              <div>
                                <h3
                                  className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5"
                                  style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                                >
                                  Skills
                                </h3>
                                <div className="text-[11px] space-y-2">
                                  {Object.entries(
                                    docsData.skills.reduce((acc: Record<string, string[]>, s) => {
                                      const cat = s.category || 'General';
                                      if (!acc[cat]) acc[cat] = [];
                                      acc[cat].push(s.name);
                                      return acc;
                                    }, {})
                                  ).map(([cat, list], idx) => (
                                    <div key={idx}>
                                      <strong className="block text-slate-900 font-semibold">{cat}</strong>
                                      <span className="text-slate-600 leading-tight block">{list.join(', ')}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Education Sidebar */}
                            {docsData.educations.length > 0 && (
                              <div>
                                <h3
                                  className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5"
                                  style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                                >
                                  Education
                                </h3>
                                <div className="space-y-2">
                                  {docsData.educations.map((edu, idx) => (
                                    <div key={idx} className="text-[11px]">
                                      <span className="font-bold text-slate-900 block">{edu.institution}</span>
                                      <div className="text-slate-600">
                                        {edu.degree} {edu.grade ? `• ${edu.grade}` : ''}
                                      </div>
                                      <span className="font-mono text-slate-400 text-[10px] block">{edu.endDate}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Column (Full Width): Experience & Projects */}
                          <div className="flex-1 min-w-0 space-y-4">
                            {/* Work Experience */}
                            <div>
                              <h3
                                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2.5"
                                style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                              >
                                Professional Experience
                              </h3>
                              <div className="space-y-3">
                                {docsData.experiences.map((exp, idx) => (
                                  <div key={idx} className="space-y-0.5">
                                    <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                                      <span style={{ color: docsTheme.primary }}>{exp.title}</span>
                                      <span className="font-mono text-[10px] text-slate-500 font-normal">
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                                      </span>
                                    </div>
                                    <div className="flex items-baseline justify-between text-xs text-slate-600 italic">
                                      <span>{exp.company}</span>
                                      <span className="text-[10px] text-slate-400 not-italic">{exp.location}</span>
                                    </div>
                                    {exp.description && (
                                      <ul className="list-disc ml-4 space-y-0.5 pt-1 text-[11px] text-slate-700 leading-relaxed">
                                        {exp.description
                                          .split('\n')
                                          .map((b) => b.trim().replace(/^[•\-\*]\s*/, ''))
                                          .filter((b) => b.length > 0)
                                          .map((bullet, bIdx) => (
                                            <li key={bIdx}>{bullet}</li>
                                          ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Projects */}
                            {docsData.projects.length > 0 && (
                              <div>
                                <h3
                                  className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2"
                                  style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                                >
                                  Engineering Projects
                                </h3>
                                <div className="space-y-2">
                                  {docsData.projects.map((proj, idx) => (
                                    <div key={idx} className="space-y-0.5">
                                      <div className="flex items-baseline justify-between text-xs font-semibold text-slate-900">
                                        <span>{proj.title}</span>
                                        {proj.technologies && (
                                          <span className="text-[10px] font-mono text-slate-500 font-normal">
                                            {proj.technologies.join(', ')}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                                        {proj.shortDescription}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* SINGLE COLUMN FLOW */
                        <div className="space-y-4">
                          {/* Summary */}
                          {docsData.summary && (
                            <div>
                              <h3
                                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5"
                                style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                              >
                                Professional Summary
                              </h3>
                              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                {docsData.summary}
                              </p>
                            </div>
                          )}

                          {/* Work Experience */}
                          <div>
                            <h3
                              className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2.5"
                              style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                            >
                              Professional Experience
                            </h3>
                            <div className="space-y-3">
                              {docsData.experiences.map((exp, idx) => (
                                <div key={idx} className="space-y-0.5">
                                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                                    <span style={{ color: docsTheme.primary }}>{exp.title}</span>
                                    <span className="font-mono text-[11px] text-slate-500 font-normal">
                                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                                    </span>
                                  </div>
                                  <div className="flex items-baseline justify-between text-xs text-slate-600 italic">
                                    <span>{exp.company}</span>
                                    <span className="text-[11px] text-slate-500 not-italic">{exp.location}</span>
                                  </div>
                                  {exp.description && (
                                    <ul className="list-disc ml-4 space-y-0.5 pt-1 text-[11px] text-slate-700 leading-relaxed">
                                      {exp.description
                                        .split('\n')
                                        .map((b) => b.trim().replace(/^[•\-\*]\s*/, ''))
                                        .filter((b) => b.length > 0)
                                        .map((bullet, bIdx) => (
                                          <li key={bIdx}>{bullet}</li>
                                        ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          {docsData.projects.length > 0 && (
                            <div>
                              <h3
                                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2"
                                style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                              >
                                Engineering Projects
                              </h3>
                              <div className="space-y-2">
                                {docsData.projects.map((proj, idx) => (
                                  <div key={idx} className="space-y-0.5">
                                    <div className="flex items-baseline justify-between text-xs font-semibold text-slate-900">
                                      <span>{proj.title}</span>
                                      {proj.technologies && (
                                        <span className="text-[10px] font-mono text-slate-500 font-normal">
                                          {proj.technologies.join(', ')}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                                      {proj.shortDescription}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Education */}
                          {docsData.educations.length > 0 && (
                            <div>
                              <h3
                                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2"
                                style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                              >
                                Education &amp; Credentials
                              </h3>
                              <div className="space-y-2">
                                {docsData.educations.map((edu, idx) => (
                                  <div key={idx} className="flex items-baseline justify-between text-xs">
                                    <div>
                                      <span className="font-bold text-slate-900">{edu.institution}</span>
                                      <div className="text-[11px] text-slate-600">
                                        {edu.degree} {edu.grade ? `• ${edu.grade}` : ''}
                                      </div>
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-500">{edu.endDate}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {docsData.skills.length > 0 && (
                            <div>
                              <h3
                                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2"
                                style={{ color: docsTheme.primary, borderColor: docsTheme.primary }}
                              >
                                Technical Skills
                              </h3>
                              <div className="text-[11px] leading-relaxed text-slate-800 space-y-1">
                                {Object.entries(
                                  docsData.skills.reduce((acc: Record<string, string[]>, s) => {
                                    const cat = s.category || 'General';
                                    if (!acc[cat]) acc[cat] = [];
                                    acc[cat].push(s.name);
                                    return acc;
                                  }, {})
                                ).map(([cat, list], idx) => (
                                  <div key={idx} className="flex items-start gap-1">
                                    <strong className="font-semibold text-slate-900 min-w-[120px]">{cat}:</strong>
                                    <span className="text-slate-700">{list.join(', ')}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
