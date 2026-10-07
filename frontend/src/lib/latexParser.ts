// LaTeX Parser, Multi-Design Templates & Two-Column Support for Resume Customizer

export interface PortfolioResumeData {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  websiteUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  summary?: string;
  experiences: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;
  educations: Array<{
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
  }>;
  skills: Array<{
    name: string;
    category: string;
  }>;
  projects: Array<{
    title: string;
    role?: string;
    technologies?: string[];
    liveUrl?: string;
    githubUrl?: string;
    shortDescription?: string;
  }>;
}

export interface LatexTemplateMeta {
  id: string;
  name: string;
  category: 'single' | 'two-column';
  badge: string;
  description: string;
  code: string;
  col1Code?: string;
  col2Code?: string;
}

export interface ExtractedTwoColumns {
  isTwoColumn: boolean;
  col1: string;
  col2: string;
  header: string;
  footer: string;
  width1: string;
  width2: string;
}

export function extractTwoColumnsFromLatex(latex: string): ExtractedTwoColumns {
  const minipageRegex = /\\begin\{minipage\}(\[[^\]]*\])?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}\s*(\\hfill)?\s*\\begin\{minipage\}(\[[^\]]*\])?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}/;
  const match = latex.match(minipageRegex);

  if (!match) {
    return {
      isTwoColumn: false,
      col1: '',
      col2: '',
      header: latex,
      footer: '',
      width1: '0.32\\textwidth',
      width2: '0.65\\textwidth',
    };
  }

  const matchIndex = match.index || 0;
  const matchLength = match[0].length;
  const header = latex.substring(0, matchIndex).trimEnd();
  const footer = latex.substring(matchIndex + matchLength).trimStart();
  const width1 = match[2] || '0.32\\textwidth';
  const col1 = match[3].trim();
  const width2 = match[6] || '0.65\\textwidth';
  const col2 = match[7].trim();

  return {
    isTwoColumn: true,
    col1,
    col2,
    header,
    footer,
    width1,
    width2,
  };
}

export function assembleTwoColumnLatex(
  header: string,
  col1: string,
  col2: string,
  footer: string,
  width1: string = '0.32\\textwidth',
  width2: string = '0.65\\textwidth'
): string {
  return `${header}

% Two Column Container (Page 1: Column 1 | Page 2: Column 2)
\\begin{minipage}[t]{${width1}}

${col1}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{${width2}}

${col2}

\\end{minipage}

${footer}`;
}

export const LATEX_TEMPLATES: Record<string, LatexTemplateMeta> = {
  jakes: {
    id: 'jakes',
    name: "Jake's Resume (FAANG / SWE Gold Standard)",
    category: 'single',
    badge: 'Single Column • ATS-Verified',
    description: 'The industry-standard single column tech resume used by software engineers at Google, Meta, Apple, and Amazon.',
    code: `%-------------------------
% Resume in LaTeX - Jake's Resume (Single Column)
% License : MIT
%-------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Debkanta Dey} \\\\ \\vspace{2pt}
    \\small +1 (415) 890-4211 $|$ \\href{mailto:alex@alexmorgan.dev}{\\underline{alex@alexmorgan.dev}} $|$ 
    \\href{https://linkedin.com/in/alexmorgan-dev}{\\underline{linkedin.com/in/alexmorgan}} $|$
    \\href{https://github.com/alexmorgan}{\\underline{github.com/alexmorgan}} $|$
    \\href{https://alexmorgan.dev}{\\underline{alexmorgan.dev}}
\\end{center}

%-----------SUMMARY-----------
\\section{Professional Summary}
Senior full-stack engineer and cloud architect with 8+ years designing high-throughput microservices, scalable distributed backends, and responsive Next.js applications. Proven track record leading agile squads, cutting cloud compute expenses by 42\\%, and building fault-tolerant transactional architectures processing 40M+ daily events.

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {University of California, Berkeley}{Berkeley, CA}
      {Bachelor of Science in Computer Science, Magna Cum Laude}{Aug 2014 -- May 2018}
      \\resumeItemListStart
        \\resumeItem{GPA: 3.89 / 4.00 $|$ Dean's Honors List (All 8 Semesters) $|$ ACM Chapter President}
        \\resumeItem{Relevant Coursework: Distributed Systems, Database Internals, Compilers, Computer Networks, Algorithms}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {Senior Full-Stack Architect}{Mar 2022 -- Present}
      {Nexus Cloud Systems}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Architected distributed microservices powering 40M+ daily telemetry events using Next.js 15, Node.js, and PostgreSQL.}
        \\resumeItem{Spearheaded migration to serverless edge computing, reducing p99 API latency by 42\\% and annual cloud compute bills by \\$180,000.}
        \\resumeItem{Mentored cross-functional team of 12 mid-level and junior software engineers across three agile engineering squads.}
        \\resumeItem{Implemented Redis multi-tier caching and database read replicas, cutting mean query latency from 340ms to 45ms.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Lead Software Engineer}{Jan 2020 -- Feb 2022}
      {Vanguard Financial Technologies}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Built real-time cryptographic transaction auditing pipelines with zero downtime across 2+ years of operation.}
        \\resumeItem{Engineered performant React component system, boosting client page speed scores from 64 to 98 on Core Web Vitals.}
        \\resumeItem{Integrated automated CI/CD security pipelines using GitHub Actions, Docker containers, and Kubernetes clusters.}
        \\resumeItem{Designed idempotent payment settlement services processing \\$15M+ in weekly transaction volume with zero financial drift.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Full-Stack Developer}{Jun 2018 -- Dec 2019}
      {Nova Interactive Labs}{Austin, TX}
      \\resumeItemListStart
        \\resumeItem{Built custom web applications, RESTful microservices, and interactive data visualization dashboards for 15+ clients.}
        \\resumeItem{Authored reusable React component libraries and design tokens adopted company-wide by 30+ engineers.}
        \\resumeItem{Delivered all customer milestones on schedule with zero critical production bugs and 99.8\\% test coverage.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Featured Engineering Projects}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{Distributed Cache Fabric} $|$ \\emph{Go, Redis, gRPC, Docker, Prometheus}}{2024}
          \\resumeItemListStart
            \\resumeItem{High-performance in-memory caching layer handling 150K QPS with sub-millisecond p95 read latency.}
            \\resumeItem{Implemented distributed consensus algorithm and automatic cluster node failover routines with zero data loss.}
          \\resumeItemListEnd
      \\resumeProjectHeading
          {\\textbf{AuraFlow -- Collaborative AI Workspace} $|$ \\emph{React, Next.js, WebSockets, PostgreSQL, TailwindCSS}}{2023}
          \\resumeItemListStart
            \\resumeItem{Modern collaborative workspace with sub-50ms conflict resolution using CRDTs synchronized over WebSockets.}
            \\resumeItem{Integrated multi-model LLM copilot summarizing meeting transcripts and generating structured project task graphs.}
          \\resumeItemListEnd
      \\resumeProjectHeading
          {\\textbf{NovaPay -- Multi-Currency Merchant Ledger} $|$ \\emph{Node.js, Express, TypeScript, PostgreSQL, Prisma}}{2023}
          \\resumeItemListStart
            \\resumeItem{Double-entry bookkeeping engine guaranteeing zero ledger imbalances across 35+ global fiat currencies.}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: TypeScript, JavaScript, Python, Go, SQL (PostgreSQL), Bash, HTML5, CSS3} \\\\
     \\textbf{Frameworks}{: Next.js 15, React, Node.js, Express, TailwindCSS, Prisma ORM, TRPC, GraphQL} \\\\
     \\textbf{Databases \\& Caching}{: PostgreSQL, Redis, Apache Kafka, MongoDB, Database Replication, Connection Pooling} \\\\
     \\textbf{DevOps \\& Cloud}{: Docker, Kubernetes, AWS (EC2, S3, RDS, CloudFront), GCP, GitHub Actions, CI/CD, Prometheus} \\\\
     \\textbf{Methodologies}{: Microservices Architecture, TDD, Clean Architecture, Distributed Consensus, High Availability}
    }}
 \\end{itemize}

%-----------HONORS & CERTIFICATIONS-----------
\\section{Honors \\& Certifications}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{AWS Certified Solutions Architect -- Associate} $|$ Amazon Web Services (2023) \\\\
     \\textbf{Certified Kubernetes Administrator (CKA)} $|$ The Linux Foundation (2022) \\\\
     \\textbf{1st Place Winner} $|$ UC Berkeley Annual Hackathon (Distributed Edge Cache Project)
    }}
 \\end{itemize}

\\end{document}
`,
  },

  deedy: {
    id: 'deedy',
    name: 'Deedy Modern (Two-Column Sidebar Layout)',
    category: 'two-column',
    badge: 'Two Column • 2-Page Code Split',
    description: 'Iconic two-column resume design with code split into separate pages for each column in the editor (Page 1: Left Sidebar, Page 2: Experience & Projects) and compiled into a unified layout.',
    col1Code: `% =========================================================
% PAGE 1: COLUMN 1 — PROFILE, CONTACT, EDUCATION & SKILLS
% =========================================================

\\section{Contact}
San Francisco, CA (Remote) \\\\
Phone: +1 (415) 890-4211 \\\\
Email: \\href{mailto:alex@alexmorgan.dev}{alex@alexmorgan.dev} \\\\
GitHub: \\href{https://github.com/alexmorgan}{github.com/alexmorgan} \\\\
LinkedIn: \\href{https://linkedin.com/in/alexmorgan}{linkedin.com/in/alexmorgan}

\\section{Profile}
Senior full-stack architect with 8+ years designing high-throughput microservices, scalable distributed backends, and responsive Next.js applications scaling to 40M+ daily events.

\\section{Education}
\\textbf{UC Berkeley} \\\\
B.S. in Computer Science \\\\
Magna Cum Laude \\\\
GPA: 3.89 / 4.00 \\\\
2014 -- 2018

\\section{Technical Skills}
\\textbf{Languages} \\\\
TypeScript, JavaScript, \\\\
Python, Go, SQL (Postgres) \\\\
\\vspace{3pt}
\\textbf{Frameworks} \\\\
Next.js 15, React, Node.js, \\\\
Express, TailwindCSS, Prisma \\\\
\\vspace{3pt}
\\textbf{Cloud \\& DevOps} \\\\
Docker, Kubernetes, AWS, \\\\
GCP, Redis, Kafka, CI/CD

\\section{Awards \\& Honors}
AWS Solutions Architect \\\\
Certified Kubernetes Admin \\\\
Hackathon 1st Place (2022) \\\\
Dean's Honors List`,
    col2Code: `% =========================================================
% PAGE 2: COLUMN 2 — PROFESSIONAL EXPERIENCE & PROJECTS
% =========================================================

\\section{Professional Experience}

\\textbf{Senior Full-Stack Architect} \\hfill Mar 2022 -- Present \\\\
\\textit{Nexus Cloud Systems} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Directing architecture of telemetry platform processing 40M+ daily events using Next.js 15, Node.js, and PostgreSQL.
    \\item Reduced p99 API latency by 42\\% through Redis multi-tier caching and database indexing.
    \\item Mentored cross-functional team of 12 mid-level and junior software engineers across three agile squads.
    \\item Spearheaded serverless edge migration, cutting annual cloud infrastructure bills by \\$180,000.
\\end{itemize}

\\vspace{3pt}
\\textbf{Lead Software Engineer} \\hfill Jan 2020 -- Feb 2022 \\\\
\\textit{Vanguard Financial Technologies} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Engineered high-throughput financial ledger processing \\$15M+ in weekly transaction volume with zero downtime.
    \\item Constructed responsive merchant analytics portal with real-time settlement tracking and PDF generation.
    \\item Boosted client Core Web Vitals from 64 to 98 through edge SSR and code splitting.
\\end{itemize}

\\vspace{3pt}
\\textbf{Full-Stack Developer} \\hfill Jun 2018 -- Dec 2019 \\\\
\\textit{Nova Interactive Labs} \\hfill Austin, TX
\\begin{itemize}
    \\item Built custom web applications and RESTful microservices for 15+ external enterprise clients.
    \\item Maintained 99.9\\% client satisfaction rating with zero critical production bugs.
\\end{itemize}

\\section{Featured Engineering Projects}

\\textbf{Distributed Cache Fabric} \\hfill Go, Redis, Docker
\\begin{itemize}
    \\item High-performance in-memory caching engine handling 150K QPS with sub-millisecond p95 read latency.
    \\item Implemented distributed consensus algorithm and automated cluster failover routines.
\\end{itemize}

\\vspace{2pt}
\\textbf{AuraFlow Collaborative Workspace} \\hfill Next.js, WebSockets, PostgreSQL
\\begin{itemize}
    \\item Real-time collaborative canvas and document processing suite powered by CRDT conflict resolution.
\\end{itemize}

\\vspace{2pt}
\\textbf{NovaPay Multi-Currency Ledger} \\hfill Node.js, Express, TypeScript, PostgreSQL
\\begin{itemize}
    \\item Double-entry bookkeeping engine guaranteeing zero ledger imbalances across 35+ global fiat currencies.
\\end{itemize}`,
    code: `%-------------------------
% Deedy - Modern Two-Column Resume in LaTeX
% License : MIT
%-------------------------
\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{hyperref}
\\usepackage{xcolor}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\begin{document}

% Top Header
\\begin{center}
    {\\Huge \\textbf{Debkanta Dey}} \\\\
    \\vspace{2pt}
    {\\large \\textit{Senior Full-Stack Architect \\& Distributed Systems Engineer}} \\\\
    \\vspace{4pt}
    alex@alexmorgan.dev $|$ +1 (415) 890-4211 $|$ San Francisco, CA $|$ \\href{https://alexmorgan.dev}{alexmorgan.dev}
\\end{center}

\\noindent\\rule{\\textwidth}{1pt}

% Two Column Container (Page 1: Column 1 | Page 2: Column 2)
\\begin{minipage}[t]{0.32\\textwidth}

\\section{Contact}
San Francisco, CA (Remote) \\\\
Phone: +1 (415) 890-4211 \\\\
Email: \\href{mailto:alex@alexmorgan.dev}{alex@alexmorgan.dev} \\\\
GitHub: \\href{https://github.com/alexmorgan}{github.com/alexmorgan} \\\\
LinkedIn: \\href{https://linkedin.com/in/alexmorgan}{linkedin.com/in/alexmorgan}

\\section{Profile}
Senior full-stack architect with 8+ years designing high-throughput microservices, scalable distributed backends, and responsive Next.js applications scaling to 40M+ daily events.

\\section{Education}
\\textbf{UC Berkeley} \\\\
B.S. in Computer Science \\\\
Magna Cum Laude \\\\
GPA: 3.89 / 4.00 \\\\
2014 -- 2018

\\section{Technical Skills}
\\textbf{Languages} \\\\
TypeScript, JavaScript, \\\\
Python, Go, SQL (Postgres) \\\\
\\vspace{3pt}
\\textbf{Frameworks} \\\\
Next.js 15, React, Node.js, \\\\
Express, TailwindCSS, Prisma \\\\
\\vspace{3pt}
\\textbf{Cloud \\& DevOps} \\\\
Docker, Kubernetes, AWS, \\\\
GCP, Redis, Kafka, CI/CD

\\section{Awards \\& Honors}
AWS Solutions Architect \\\\
Certified Kubernetes Admin \\\\
Hackathon 1st Place (2022) \\\\
Dean's Honors List

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.65\\textwidth}

\\section{Professional Experience}

\\textbf{Senior Full-Stack Architect} \\hfill Mar 2022 -- Present \\\\
\\textit{Nexus Cloud Systems} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Directing architecture of telemetry platform processing 40M+ daily events using Next.js 15, Node.js, and PostgreSQL.
    \\item Reduced p99 API latency by 42\\% through Redis multi-tier caching and database indexing.
    \\item Mentored cross-functional team of 12 mid-level and junior software engineers across three agile squads.
    \\item Spearheaded serverless edge migration, cutting annual cloud infrastructure bills by \\$180,000.
\\end{itemize}

\\vspace{3pt}
\\textbf{Lead Software Engineer} \\hfill Jan 2020 -- Feb 2022 \\\\
\\textit{Vanguard Financial Technologies} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Engineered high-throughput financial ledger processing \\$15M+ in weekly transaction volume with zero downtime.
    \\item Constructed responsive merchant analytics portal with real-time settlement tracking and PDF generation.
    \\item Boosted client Core Web Vitals from 64 to 98 through edge SSR and code splitting.
\\end{itemize}

\\vspace{3pt}
\\textbf{Full-Stack Developer} \\hfill Jun 2018 -- Dec 2019 \\\\
\\textit{Nova Interactive Labs} \\hfill Austin, TX
\\begin{itemize}
    \\item Built custom web applications and RESTful microservices for 15+ external enterprise clients.
    \\item Maintained 99.9\\% client satisfaction rating with zero critical production bugs.
\\end{itemize}

\\section{Featured Engineering Projects}

\\textbf{Distributed Cache Fabric} \\hfill Go, Redis, Docker
\\begin{itemize}
    \\item High-performance in-memory caching engine handling 150K QPS with sub-millisecond p95 read latency.
    \\item Implemented distributed consensus algorithm and automated cluster failover routines.
\\end{itemize}

\\vspace{2pt}
\\textbf{AuraFlow Collaborative Workspace} \\hfill Next.js, WebSockets, PostgreSQL
\\begin{itemize}
    \\item Real-time collaborative canvas and document processing suite powered by CRDT conflict resolution.
\\end{itemize}

\\vspace{2pt}
\\textbf{NovaPay Multi-Currency Ledger} \\hfill Node.js, Express, TypeScript, PostgreSQL
\\begin{itemize}
    \\item Double-entry bookkeeping engine guaranteeing zero ledger imbalances across 35+ global fiat currencies.
\\end{itemize}

\\end{minipage}

\\end{document}
`,
  },

  harvard: {
    id: 'harvard',
    name: 'Harvard / Ivy Classic (Single Column)',
    category: 'single',
    badge: 'Single Column • Academic & Consulting',
    description: 'Traditional academic and executive layout with centered header, uppercase section rules, and formal serif typography.',
    code: `%-------------------------
% Harvard / Ivy Classic Resume in LaTeX
%-------------------------
\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{hyperref}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\begin{document}

\\begin{center}
    {\\Large \\textbf{Debkanta Dey}} \\\\
    \\vspace{3pt}
    Senior Full-Stack Architect $\\cdot$ Cloud Systems Engineer \\\\
    San Francisco, CA $\\cdot$ alex@alexmorgan.dev $\\cdot$ +1 (415) 890-4211 \\\\
    \\href{https://alexmorgan.dev}{https://alexmorgan.dev} $|$ \\href{https://github.com/alexmorgan}{github.com/alexmorgan}
\\end{center}

\\noindent\\rule{\\textwidth}{0.8pt}

\\section*{PROFESSIONAL SUMMARY}
Software Architect with 8+ years designing fault-tolerant distributed platforms, high-performance Next.js applications, and microservices processing millions of daily transactions. Adept in cloud architecture, database optimization, and leading engineering squads.

\\section*{EDUCATION}
\\textbf{University of California, Berkeley} \\hfill Berkeley, CA \\\\
Bachelor of Science in Computer Science, Magna Cum Laude \\hfill May 2018 \\\\
GPA: 3.89 / 4.00 $|$ Dean's Honors List $|$ President, Association for Computing Machinery (ACM) Student Chapter \\\\
Thesis: \\textit{High-Throughput Distributed Consensus over Low-Latency Peer-to-Peer Topologies}

\\section*{PROFESSIONAL EXPERIENCE}

\\textbf{Senior Full-Stack Architect} \\hfill Mar 2022 -- Present \\\\
\\textit{Nexus Cloud Systems, San Francisco, CA}
\\begin{itemize}
    \\item Directed distributed infrastructure initiatives supporting 40,000,000+ daily analytical events.
    \\item Authored technical RFCs on zero-downtime database migrations and automated failover topologies.
    \\item Reduced p99 latency by 42\\% and cloud compute expenditure by \\$180,000 annually.
    \\item Spearheaded architectural review board (ARB) and mentored 12 mid-level and senior software developers.
\\end{itemize}

\\vspace{3pt}
\\textbf{Lead Software Engineer} \\hfill Jan 2020 -- Feb 2022 \\\\
\\textit{Vanguard Financial Technologies, San Francisco, CA}
\\begin{itemize}
    \\item Supervised team of six software developers building fault-tolerant fintech platforms handling \\$15M+ weekly.
    \\item Designed low-latency WebSocket communication engine handling 50,000 concurrent streaming connections.
    \\item Achieved 100/100 Google Core Web Vitals on flagship client dashboard through server-side rendering.
\\end{itemize}

\\vspace{3pt}
\\textbf{Software Developer} \\hfill Jun 2018 -- Dec 2019 \\\\
\\textit{Nova Interactive Labs, Austin, TX}
\\begin{itemize}
    \\item Developed full-stack software solutions for 15+ enterprise clients with zero critical regressions.
    \\item Automated CI/CD deployment workflows with GitHub Actions and Docker, reducing build cycles by 50\\%.
\\end{itemize}

\\section*{FEATURED ENGINEERING PROJECTS}
\\textbf{Distributed Cache Fabric} $|$ \\textit{Go, Redis, gRPC, Docker, Prometheus} \\hfill 2024 \\\\
In-memory caching engine handling 150,000 requests per second with sub-millisecond p95 read latency.

\\vspace{2pt}
\\textbf{AuraFlow -- Collaborative AI Workspace} $|$ \\textit{React, Next.js, WebSockets, PostgreSQL} \\hfill 2023 \\\\
Real-time collaborative editing platform featuring Conflict-free Replicated Data Types (CRDTs) and AI summarization.

\\section*{TECHNICAL PROFICIENCIES}
\\textbf{Programming:} TypeScript, JavaScript, Python, Go, SQL (PostgreSQL), Bash, HTML5, CSS3 \\\\
\\textbf{Platforms \\& Frameworks:} Next.js 15, React, Node.js, Express, Docker, Kubernetes, AWS, GCP, Redis, Kafka \\\\
\\textbf{Methodologies:} Microservices, Distributed Systems, TDD, Clean Architecture, CI/CD

\\section*{HONORS \\& AFFILIATIONS}
AWS Certified Solutions Architect (2023) $\\cdot$ Certified Kubernetes Administrator (2022) $\\cdot$ IEEE Member

\\end{document}
`,
  },

  executive_split: {
    id: 'executive_split',
    name: 'Executive Slate (Two-Column Dark Accent)',
    category: 'two-column',
    badge: 'Two Column • 2-Page Code Split',
    description: 'Distinguished executive layout with code divided into separate pages for each column in the editor (Page 1: Executive Profile, Page 2: Leadership Milestones & Flagship Systems).',
    col1Code: `% =========================================================
% PAGE 1: COLUMN 1 — EXECUTIVE CREDENTIALS & COMPETENCIES
% =========================================================

\\section{Executive Focus}
\\begin{itemize}
    \\item Distributed Systems Architecture
    \\item Cloud Economics \\& FinOps
    \\item Agile Squad Leadership
    \\item Enterprise Security \\& Compliance
\\end{itemize}

\\section{Education}
\\textbf{UC Berkeley} \\\\
B.S. in Computer Science \\\\
Magna Cum Laude \\\\
2014 -- 2018

\\section{Core Technologies}
\\textbf{Backend \\& Data} \\\\
Node.js, Go, Python, \\\\
PostgreSQL, Redis, Kafka \\\\
\\vspace{3pt}
\\textbf{Frontend \\& Edge} \\\\
Next.js 15, TypeScript, \\\\
React, TailwindCSS \\\\
\\vspace{3pt}
\\textbf{DevOps \\& Cloud} \\\\
Docker, Kubernetes, \\\\
AWS, GCP, Terraform

\\section{Certifications}
AWS Solutions Architect \\\\
Certified Kubernetes Administrator \\\\
Board Technical Advisor`,
    col2Code: `% =========================================================
% PAGE 2: COLUMN 2 — LEADERSHIP MILESTONES & SYSTEMS
% =========================================================

\\section{Leadership \\& Career Milestones}

\\textbf{VP of Architecture \\& Staff Architect} \\hfill Mar 2022 -- Present \\\\
\\textit{Nexus Cloud Systems} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Directed architecture for multi-tenant analytics platform processing \\$40M+ annual volume with 99.99\\% uptime.
    \\item Established Architectural Review Board (ARB) and mentored 12 mid/senior software developers across 3 squads.
    \\item Spearheaded edge infrastructure migration reducing enterprise hosting bills by 35\\% (\\$180K/yr savings).
\\end{itemize}

\\vspace{3pt}
\\textbf{Director of Software Engineering} \\hfill Jan 2020 -- Feb 2022 \\\\
\\textit{Vanguard Financial Technologies} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Directed squad of 8 engineers delivering real-time fraud monitoring and settlement engine.
    \\item Achieved 100/100 Core Web Vitals on flagship web application through edge SSR.
    \\item Introduced automated integration test pipelines reducing regressions by 80\\%.
\\end{itemize}

\\vspace{3pt}
\\textbf{Senior Full-Stack Architect} \\hfill Jun 2018 -- Dec 2019 \\\\
\\textit{Nova Interactive Labs} \\hfill Austin, TX
\\begin{itemize}
    \\item Led technical delivery for 15+ custom software engagements spanning enterprise fintech and healthcare.
\\end{itemize}

\\section{Flagship Enterprise Systems}
\\textbf{Distributed Cache Fabric} \\hfill Go, Redis, gRPC, Docker \\\\
High-throughput caching engine scaling to 150K QPS with sub-millisecond p95 latency and automated failover.

\\vspace{2pt}
\\textbf{AuraFlow Enterprise Workspace} \\hfill Next.js 15, WebSockets, PostgreSQL \\\\
Collaborative real-time canvas and document processing suite powered by CRDT conflict resolution.`,
    code: `%-------------------------
% Executive Slate Two-Column Resume in LaTeX
% License : MIT
%-------------------------
\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{hyperref}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\begin{document}

% Top Header
\\begin{center}
    {\\Huge \\textbf{Debkanta Dey}} \\\\
    \\vspace{2pt}
    {\\large \\textbf{Staff Software Architect \\& Engineering Director}} \\\\
    \\vspace{4pt}
    San Francisco, CA $|$ alex@alexmorgan.dev $|$ +1 (415) 890-4211 $|$ \\href{https://alexmorgan.dev}{alexmorgan.dev}
\\end{center}

\\noindent\\rule{\\textwidth}{1.5pt}

% Two Column Body (Page 1: Column 1 | Page 2: Column 2)
\\begin{minipage}[t]{0.33\\textwidth}

\\section{Executive Focus}
\\begin{itemize}
    \\item Distributed Systems Architecture
    \\item Cloud Economics \\& FinOps
    \\item Agile Squad Leadership
    \\item Enterprise Security \\& Compliance
\\end{itemize}

\\section{Education}
\\textbf{UC Berkeley} \\\\
B.S. in Computer Science \\\\
Magna Cum Laude \\\\
2014 -- 2018

\\section{Core Technologies}
\\textbf{Backend \\& Data} \\\\
Node.js, Go, Python, \\\\
PostgreSQL, Redis, Kafka \\\\
\\vspace{3pt}
\\textbf{Frontend \\& Edge} \\\\
Next.js 15, TypeScript, \\\\
React, TailwindCSS \\\\
\\vspace{3pt}
\\textbf{DevOps \\& Cloud} \\\\
Docker, Kubernetes, \\\\
AWS, GCP, Terraform

\\section{Certifications}
AWS Solutions Architect \\\\
Certified Kubernetes Administrator \\\\
Board Technical Advisor

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.64\\textwidth}

\\section{Leadership \\& Career Milestones}

\\textbf{VP of Architecture \\& Staff Architect} \\hfill Mar 2022 -- Present \\\\
\\textit{Nexus Cloud Systems} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Directed architecture for multi-tenant analytics platform processing \\$40M+ annual volume with 99.99\\% uptime.
    \\item Established Architectural Review Board (ARB) and mentored 12 mid/senior software developers across 3 squads.
    \\item Spearheaded edge infrastructure migration reducing enterprise hosting bills by 35\\% (\\$180K/yr savings).
\\end{itemize}

\\vspace{3pt}
\\textbf{Director of Software Engineering} \\hfill Jan 2020 -- Feb 2022 \\\\
\\textit{Vanguard Financial Technologies} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Directed squad of 8 engineers delivering real-time fraud monitoring and settlement engine.
    \\item Achieved 100/100 Core Web Vitals on flagship web application through edge SSR.
    \\item Introduced automated integration test pipelines reducing regressions by 80\\%.
\\end{itemize}

\\vspace{3pt}
\\textbf{Senior Full-Stack Architect} \\hfill Jun 2018 -- Dec 2019 \\\\
\\textit{Nova Interactive Labs} \\hfill Austin, TX
\\begin{itemize}
    \\item Led technical delivery for 15+ custom software engagements spanning enterprise fintech and healthcare.
\\end{itemize}

\\section{Flagship Enterprise Systems}
\\textbf{Distributed Cache Fabric} \\hfill Go, Redis, gRPC, Docker \\\\
High-throughput caching engine scaling to 150K QPS with sub-millisecond p95 latency and automated failover.

\\vspace{2pt}
\\textbf{AuraFlow Enterprise Workspace} \\hfill Next.js 15, WebSockets, PostgreSQL \\\\
Collaborative real-time canvas and document processing suite powered by CRDT conflict resolution.

\\end{minipage}

\\end{document}
`,
  },

  tech_minimal: {
    id: 'tech_minimal',
    name: 'Tech Minimalist (Single Column Clean)',
    category: 'single',
    badge: 'Single Column • Minimalist Code',
    description: 'Ultra-clean single column developer resume focusing on technical depth, impact metrics, and concise bullet points.',
    code: `%-------------------------
% Tech Minimalist Resume in LaTeX (Single Column)
%-------------------------
\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{hyperref}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{Debkanta Dey}} \\\\
    \\vspace{2pt}
    \\small Senior Full-Stack Engineer \\& Cloud Architect \\\\
    \\vspace{2pt}
    alex@alexmorgan.dev $|$ +1 (415) 890-4211 $|$ San Francisco, CA $|$ \\href{https://alexmorgan.dev}{alexmorgan.dev} $|$ \\href{https://github.com/alexmorgan}{github.com/alexmorgan}
\\end{center}

\\section{Summary}
Senior software engineer with 8+ years designing and delivering high-throughput cloud architectures, deterministic TypeScript microservices, and high-performance Next.js web applications scaling to millions of daily requests.

\\section{Technical Proficiencies}
\\textbf{Languages:} TypeScript, JavaScript, Python, Go, SQL (PostgreSQL), Bash, HTML5, CSS3 \\\\
\\textbf{Frameworks \\& Libraries:} Next.js 15, React, Node.js, Express, TailwindCSS, Prisma ORM, TRPC, GraphQL \\\\
\\textbf{DevOps \\& Infrastructure:} Docker, Kubernetes, AWS, Google Cloud Platform, GitHub Actions, Redis, Kafka

\\section{Work History}

\\textbf{Senior Full-Stack Architect} \\hfill Mar 2022 -- Present \\\\
\\textit{Nexus Cloud Systems} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Architected and launched resilient multi-tenant SaaS platform processing \\$40M+ annual transaction volume.
    \\item Decreased average API response times from 340ms to 45ms through distributed cache hierarchies and database indexing.
    \\item Championed TypeScript type-safety standards across 14 backend and frontend microservices.
    \\item Directed migration to serverless edge computing, reducing cloud compute costs by \\$180K annually.
\\end{itemize}

\\vspace{3pt}
\\textbf{Lead Software Engineer} \\hfill Jan 2020 -- Feb 2022 \\\\
\\textit{Vanguard Financial Technologies} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Led frontend engineering migration to Next.js SSR, achieving 99.8\\% uptime and 100/100 Core Web Vitals.
    \\item Designed real-time event pipeline using Apache Kafka and PostgreSQL read replicas handling 50K concurrent streams.
    \\item Directly supervised 6 full-stack engineers and instituted automated integration test standards.
\\end{itemize}

\\vspace{3pt}
\\textbf{Full-Stack Developer} \\hfill Jun 2018 -- Dec 2019 \\\\
\\textit{Nova Interactive Labs} \\hfill Austin, TX
\\begin{itemize}
    \\item Engineered bespoke single-page applications and RESTful microservices for 15+ external enterprise clients.
    \\item Created reusable React component design tokens adopted company-wide across engineering squads.
\\end{itemize}

\\section{Key Engineering Projects}
\\textbf{Distributed Cache Fabric} $|$ \\textit{Go, Redis, Docker} \\hfill 2024 \\\\
In-memory caching engine handling 150K requests per second with sub-millisecond p95 latency.

\\vspace{2pt}
\\textbf{AuraFlow Collaborative Workspace} $|$ \\textit{Next.js, TypeScript, PostgreSQL} \\hfill 2023 \\\\
Real-time collaborative editing platform featuring Conflict-free Replicated Data Types (CRDTs) and AI summarization.

\\section{Education}
\\textbf{University of California, Berkeley} \\hfill Berkeley, CA \\\\
Bachelor of Science in Computer Science, Magna Cum Laude \\hfill 2014 -- 2018 \\\\
GPA: 3.89 / 4.00 $|$ Dean's Honors List $|$ President, ACM Chapter

\\section{Certifications}
AWS Certified Solutions Architect (2023) $|$ Certified Kubernetes Administrator (2022)

\\end{document}
`,
  },
};

// Generates LaTeX code from current Portfolio database state (Single or Two-Column)
export function generateLatexFromPortfolio(
  data: PortfolioResumeData,
  layout: 'single' | 'two-column' = 'single'
): string {
  if (layout === 'two-column') {
    return generateTwoColumnLatex(data);
  }
  return generateSingleColumnLatex(data);
}

function generateSingleColumnLatex(data: PortfolioResumeData): string {
  const experiencesLatex = (data.experiences && data.experiences.length > 0 ? data.experiences : [
    {
      title: 'Senior Full-Stack Architect',
      company: 'Nexus Cloud Systems',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Architected distributed microservices powering 40M+ daily telemetry events using Next.js 15, Node.js, and PostgreSQL.\nSpearheaded migration to serverless edge computing, reducing p99 API latency by 42% and cloud costs by $180K/yr.\nMentored 12 mid-level and junior software engineers across three cross-functional agile engineering squads.',
    },
    {
      title: 'Lead Software Engineer',
      company: 'Vanguard Financial Technologies',
      location: 'San Francisco, CA',
      startDate: '2020',
      endDate: '2022',
      current: false,
      description: 'Built real-time cryptographic transaction auditing pipelines with zero downtime across 2+ years.\nEngineered performant React component system, boosting client page speed scores from 64 to 98 on Core Web Vitals.\nIntegrated automated CI/CD security pipelines using GitHub Actions, Docker, and Kubernetes.',
    },
  ])
    .map((exp) => {
      const dates = `${exp.startDate} -- ${exp.current ? 'Present' : exp.endDate || 'Present'}`;
      const bullets = (exp.description || '')
        .split('\n')
        .map((b) => b.trim().replace(/^[•\-\*]\s*/, ''))
        .filter((b) => b.length > 0)
        .map((b) => `        \\resumeItem{${escapeLatex(b)}}`)
        .join('\n');

      return `    \\resumeSubheading
      {${escapeLatex(exp.title)}}{${dates}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location || 'Remote')}}
      \\resumeItemListStart
${bullets || `        \\resumeItem{Delivered critical software engineering milestones with high quality and measurable business impact.}`}
      \\resumeItemListEnd`;
    })
    .join('\n\n');

  const educationsLatex = (data.educations && data.educations.length > 0 ? data.educations : [
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2014',
      endDate: '2018',
      grade: '3.89 / 4.00, Magna Cum Laude',
    },
  ])
    .map((edu) => {
      const dates = `${edu.startDate || ''} -- ${edu.endDate || ''}`.trim().replace(/^--\s*|\s*--$/g, '');
      const degreeStr = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
      return `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.grade ? `GPA: ${edu.grade}` : 'Berkeley, CA')}}
      {${escapeLatex(degreeStr)}}{${dates || 'Completed'}}`;
    })
    .join('\n\n');

  const projectsLatex = (data.projects && data.projects.length > 0 ? data.projects : [
    {
      title: 'Distributed Cache Fabric',
      technologies: ['Go', 'Redis', 'gRPC', 'Docker', 'Prometheus'],
      shortDescription: 'High-performance in-memory caching layer handling 150K QPS with sub-millisecond p95 read latency.',
    },
    {
      title: 'AuraFlow Collaborative AI Workspace',
      technologies: ['Next.js 15', 'TypeScript', 'WebSockets', 'PostgreSQL'],
      shortDescription: 'Real-time collaborative workspace with conflict-free replicated data types and LLM task summarization.',
    },
  ])
    .slice(0, 4)
    .map((proj) => {
      const tech = (proj.technologies || []).join(', ');
      return `      \\resumeProjectHeading
          {\\textbf{${escapeLatex(proj.title)}} $|$ \\emph{${escapeLatex(tech)}}}{}
          \\resumeItemListStart
            \\resumeItem{${escapeLatex(proj.shortDescription || 'Engineered production-grade solution with high performance.')}}
          \\resumeItemListEnd`;
    })
    .join('\n');

  const skillsByCategory: Record<string, string[]> = {};
  const skillList = data.skills && data.skills.length > 0 ? data.skills : [
    { name: 'TypeScript', category: 'Languages' },
    { name: 'Python', category: 'Languages' },
    { name: 'Go', category: 'Languages' },
    { name: 'SQL', category: 'Languages' },
    { name: 'Next.js 15', category: 'Frameworks' },
    { name: 'React', category: 'Frameworks' },
    { name: 'Node.js', category: 'Frameworks' },
    { name: 'PostgreSQL', category: 'Databases & Infra' },
    { name: 'Docker', category: 'Databases & Infra' },
    { name: 'AWS / GCP', category: 'Databases & Infra' },
  ];

  skillList.forEach((s) => {
    const cat = s.category || 'Core Technologies';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s.name);
  });

  const skillsLatex = Object.entries(skillsByCategory)
    .map(
      ([cat, list]) =>
        `     \\textbf{${escapeLatex(cat)}}{: ${escapeLatex(list.join(', '))}} \\\\`
    )
    .join('\n');

  return `%-------------------------
% Auto-Generated Single-Column Resume from Portfolio Data
%-------------------------
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\usepackage{enumitem}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(data.fullName || 'Debkanta Dey')}} \\\\ \\vspace{2pt}
    \\small ${escapeLatex(data.phone || '+1 (415) 890-4211')} $|$ 
    \\href{mailto:${data.email || 'alex@alexmorgan.dev'}}{\\underline{${escapeLatex(data.email || 'alex@alexmorgan.dev')}}} $|$ 
    ${data.location ? `${escapeLatex(data.location)} $|$ ` : ''}
    \\href{${data.websiteUrl || data.portfolioUrl || 'https://alexmorgan.dev'}}{\\underline{portfolio}}
\\end{center}

%-----------SUMMARY-----------
\\section{Professional Summary}
${escapeLatex(data.summary || 'Senior full-stack software engineer and cloud architect with 8+ years designing high-throughput microservices, distributed backends, and performant Next.js applications.')}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experiencesLatex}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Featured Engineering Projects}
    \\resumeSubHeadingListStart
${projectsLatex}
    \\resumeSubHeadingListEnd

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${educationsLatex}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${skillsLatex}
    }}
 \\end{itemize}

\\end{document}
`;
}

// Two-Column LaTeX Generation:
// Code divided into Page 1 (Column 1) and Page 2 (Column 2) for the editor,
// assembled into side-by-side minipages for unified single-page preview!
function generateTwoColumnLatex(data: PortfolioResumeData): string {
  const skillsByCategory: Record<string, string[]> = {};
  const skillList = data.skills && data.skills.length > 0 ? data.skills : [
    { name: 'TypeScript', category: 'Languages' },
    { name: 'Python', category: 'Languages' },
    { name: 'Go', category: 'Languages' },
    { name: 'SQL (PostgreSQL)', category: 'Languages' },
    { name: 'Next.js 15', category: 'Frameworks' },
    { name: 'React', category: 'Frameworks' },
    { name: 'Node.js', category: 'Frameworks' },
    { name: 'TailwindCSS', category: 'Frameworks' },
    { name: 'PostgreSQL', category: 'Databases & Infra' },
    { name: 'Redis', category: 'Databases & Infra' },
    { name: 'Docker', category: 'DevOps & Cloud' },
    { name: 'Kubernetes', category: 'DevOps & Cloud' },
    { name: 'AWS / GCP', category: 'DevOps & Cloud' },
  ];

  skillList.forEach((s) => {
    const cat = s.category || 'Skills';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s.name);
  });

  const skillsListLatex = Object.entries(skillsByCategory)
    .map(
      ([cat, list]) =>
        `\\textbf{${escapeLatex(cat)}} \\\\\n${escapeLatex(list.join(', '))}\\\\\n\\vspace{3pt}`
    )
    .join('\n');

  const educationsSidebar = (data.educations && data.educations.length > 0 ? data.educations : [
    {
      institution: 'UC Berkeley',
      degree: 'B.S. Comp Sci',
      fieldOfStudy: '',
      startDate: '2014',
      endDate: '2018',
      grade: 'GPA: 3.89',
    },
  ])
    .map(
      (edu) =>
        `\\textbf{${escapeLatex(edu.institution)}} \\\\\n${escapeLatex(edu.degree)} \\\\\n${edu.grade ? `${escapeLatex(edu.grade)} \\\\\n` : ''}${edu.endDate || '2018'}`
    )
    .join('\n\\vspace{4pt}\n');

  const col1 = `% =========================================================
% PAGE 1: COLUMN 1 — PROFILE, CONTACT, EDUCATION & SKILLS
% =========================================================

\\section{Contact}
${data.location ? `${escapeLatex(data.location)} \\\\\n` : 'San Francisco, CA \\\\\n'}Phone: ${escapeLatex(data.phone || '+1 (415) 890-4211')} \\\\
Email: \\href{mailto:${data.email || 'alex@alexmorgan.dev'}}{${escapeLatex(data.email || 'alex@alexmorgan.dev')}} \\\\
GitHub: \\href{${data.githubUrl || 'https://github.com/alexmorgan'}}{${escapeLatex(data.githubUrl || 'github.com/alexmorgan')}} \\\\
LinkedIn: \\href{${data.linkedinUrl || 'https://linkedin.com/in/alexmorgan'}}{${escapeLatex(data.linkedinUrl || 'linkedin.com/in/alexmorgan')}}

\\section{Profile}
${escapeLatex(data.summary || 'Senior full-stack software engineer and cloud architect with 8+ years designing high-throughput microservices, distributed backends, and performant Next.js applications.')}

\\section{Education}
${educationsSidebar}

\\section{Technical Skills}
${skillsListLatex}

\\section{Awards}
AWS Solutions Architect \\\\
Certified Kubernetes Administrator \\\\
Dean's Honors List`;

  const experiencesLatex = (data.experiences && data.experiences.length > 0 ? data.experiences : [
    {
      title: 'Senior Full-Stack Architect',
      company: 'Nexus Cloud Systems',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Directing architecture of telemetry platform processing 40M+ daily events using Next.js 15, Node.js, and PostgreSQL.\nReduced p99 API latency by 42% through Redis multi-tier caching and database indexing.\nMentored cross-functional team of 12 mid-level and junior software engineers across three agile squads.\nSpearheaded serverless edge migration, saving $180,000 annually.',
    },
    {
      title: 'Lead Software Engineer',
      company: 'Vanguard Financial Technologies',
      location: 'San Francisco, CA',
      startDate: '2020',
      endDate: '2022',
      current: false,
      description: 'Engineered high-throughput financial ledger processing $15M+ in weekly transaction volume with zero downtime.\nConstructed responsive merchant analytics portal with real-time settlement tracking and PDF generation.\nBoosted client Core Web Vitals from 64 to 98 through edge SSR.',
    },
  ])
    .map((exp) => {
      const dates = `${exp.startDate} -- ${exp.current ? 'Present' : exp.endDate || 'Present'}`;
      const bullets = (exp.description || '')
        .split('\n')
        .map((b) => b.trim().replace(/^[•\-\*]\s*/, ''))
        .filter((b) => b.length > 0)
        .map((b) => `    \\item ${escapeLatex(b)}`)
        .join('\n');

      return `\\textbf{${escapeLatex(exp.title)}} \\hfill ${dates} \\\\
\\textit{${escapeLatex(exp.company)}} \\hfill ${escapeLatex(exp.location || 'Remote')}
\\begin{itemize}
${bullets || '    \\item Developed scalable services with high reliability.'}
\\end{itemize}`;
    })
    .join('\n\n\\vspace{4pt}\n');

  const projectsLatex = (data.projects && data.projects.length > 0 ? data.projects : [
    {
      title: 'Distributed Cache Fabric',
      technologies: ['Go', 'Redis', 'Docker'],
      shortDescription: 'High-performance in-memory caching engine handling 150K QPS with sub-millisecond p95 latency.',
    },
    {
      title: 'AuraFlow Collaborative Workspace',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
      shortDescription: 'Real-time collaborative canvas and document processing suite powered by CRDT conflict resolution.',
    },
  ])
    .slice(0, 2)
    .map((p) => {
      const tech = (p.technologies || []).join(', ');
      return `\\textbf{${escapeLatex(p.title)}} ${tech ? `\\hfill ${escapeLatex(tech)}` : ''}
\\begin{itemize}
    \\item ${escapeLatex(p.shortDescription || '')}
\\end{itemize}`;
    })
    .join('\n\n\\vspace{3pt}\n');

  const col2 = `% =========================================================
% PAGE 2: COLUMN 2 — PROFESSIONAL EXPERIENCE & PROJECTS
% =========================================================

\\section{Professional Experience}

${experiencesLatex}

\\section{Featured Engineering Projects}

${projectsLatex}`;

  const header = `%-------------------------
% Auto-Generated Two-Column Resume (Page 1: Column 1 | Page 2: Column 2 in Editor)
%-------------------------
\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{hyperref}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\begin{document}

% Top Header
\\begin{center}
    {\\Huge \\textbf{${escapeLatex(data.fullName || 'Debkanta Dey')}}} \\\\
    \\vspace{2pt}
    {\\large \\textit{${escapeLatex(data.professionalTitle || 'Senior Full-Stack Architect')}}} \\\\
    \\vspace{3pt}
    ${data.location ? `${escapeLatex(data.location)} $|$ ` : ''}
    ${escapeLatex(data.email || 'alex@alexmorgan.dev')} $|$ 
    ${escapeLatex(data.phone || '+1 (415) 890-4211')} $|$ 
    \\href{${data.websiteUrl || data.portfolioUrl || 'https://alexmorgan.dev'}}{portfolio}
\\end{center}

\\noindent\\rule{\\textwidth}{1pt}`;

  const footer = `\\end{document}`;

  return assembleTwoColumnLatex(header, col1, col2, footer, '0.32\\textwidth', '0.65\\textwidth');
}

function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash ')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde ');
}

// Clean LaTeX markup to plain HTML (Single & Two-Column Minipage aware)
export function parseLatexToHtml(latex: string): { html: string; warnings: string[] } {
  const warnings: string[] = [];
  if (!latex) return { html: '', warnings };

  // Remove LaTeX comments (except escaped \%)
  let cleaned = latex
    .split('\n')
    .map((line) => {
      const commentIdx = line.indexOf('%');
      if (commentIdx === -1) return line;
      if (commentIdx > 0 && line[commentIdx - 1] === '\\') return line;
      return line.substring(0, commentIdx);
    })
    .join('\n');

  // Extract body between \begin{document} and \end{document}
  const docStart = cleaned.indexOf('\\begin{document}');
  if (docStart !== -1) {
    const docEnd = cleaned.indexOf('\\end{document}');
    if (docEnd !== -1) {
      cleaned = cleaned.substring(docStart + 16, docEnd);
    } else {
      cleaned = cleaned.substring(docStart + 16);
    }
  }

  // Remove LaTeX layout commands that must not render into text or cause gaps
  cleaned = cleaned.replace(/\\vspace\*?\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\hspace\*?\{[^}]*\}/g, ' ');
  cleaned = cleaned.replace(/\\addtolength\{[^}]*\}\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\setlength\{[^}]*\}\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\titlespacing\*?\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\titleformat\{[^}]*\}(\[[^\]]*\])?\{[^}]*\}\{[^}]*\}\{[^}]*\}(\[[^\]]*\])?/g, '');
  cleaned = cleaned.replace(/\\pagestyle\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\thispagestyle\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\fancyhf\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\urlstyle\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\raggedbottom/g, '');
  cleaned = cleaned.replace(/\\raggedright/g, '');
  cleaned = cleaned.replace(/\\noindent/g, '');
  cleaned = cleaned.replace(/\\scshape/g, '');

  // Special Characters & Math Symbols
  cleaned = cleaned.replace(/\\&/g, '&');
  cleaned = cleaned.replace(/\\%/g, '%');
  cleaned = cleaned.replace(/\\\$/g, '$');
  cleaned = cleaned.replace(/\\#/g, '#');
  cleaned = cleaned.replace(/\\_/g, '_');
  cleaned = cleaned.replace(/---/g, '&mdash;');
  cleaned = cleaned.replace(/--/g, '&ndash;');
  cleaned = cleaned.replace(/\$\|\$/g, '<span class="text-slate-400 mx-1.5 font-normal">|</span>');
  cleaned = cleaned.replace(/\\textbar/g, '<span class="text-slate-400 mx-1.5 font-normal">|</span>');
  cleaned = cleaned.replace(/\$\\cdot\$/g, '<span class="text-slate-400 mx-1">•</span>');
  cleaned = cleaned.replace(/\\cdot/g, '<span class="text-slate-400 mx-1">•</span>');
  cleaned = cleaned.replace(/\\quad/g, '&nbsp;&nbsp;');
  cleaned = cleaned.replace(/\\qquad/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

  // Hyperlinks: Professional subtle underline matching Ivy League & FAANG resumes
  cleaned = cleaned.replace(/\\href\{([^}]+)\}\{\\underline\{([^}]+)\}\}/g, (_m, url, text) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-slate-900 hover:text-blue-700 underline decoration-slate-400 underline-offset-2 break-all font-medium transition-colors">${text}</a>`;
  });
  cleaned = cleaned.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, (_m, url, text) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-slate-900 hover:text-blue-700 underline decoration-slate-400 underline-offset-2 break-all font-medium transition-colors">${text}</a>`;
  });
  cleaned = cleaned.replace(/\\url\{([^}]+)\}/g, (_m, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-slate-900 hover:text-blue-700 underline decoration-slate-400 underline-offset-2 break-all font-medium transition-colors">${url}</a>`;
  });

  // Candidate Name & Nested font combinations
  cleaned = cleaned.replace(/\\textbf\{\\Huge\s*\\scshape\s*([^}]+)\}/g, '<h1 class="text-[22px] font-bold tracking-wide text-slate-900 uppercase m-0 leading-tight mb-0.5">$1</h1>');
  cleaned = cleaned.replace(/\\textbf\{\\Huge\s*([^}]+)\}/g, '<h1 class="text-[22px] font-bold tracking-wide text-slate-900 m-0 leading-tight mb-0.5">$1</h1>');
  cleaned = cleaned.replace(/\{\s*\\Huge\s*\\textbf\{([^}]+)\}\}/g, '<h1 class="text-[22px] font-bold tracking-wide text-slate-900 m-0 leading-tight mb-0.5">$1</h1>');
  cleaned = cleaned.replace(/\{\s*\\huge\s*\\textbf\{([^}]+)\}\}/g, '<h2 class="text-[18px] font-bold tracking-tight text-slate-900 m-0 leading-tight mb-0.5">$1</h2>');
  cleaned = cleaned.replace(/\{\s*\\large\s*\\textbf\{([^}]+)\}\}/g, '<div class="text-[13px] font-bold text-slate-900 leading-snug">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\large\s*\\textit\{([^}]+)\}\}/g, '<div class="text-[12px] font-semibold italic text-slate-700 leading-snug">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\large\s*\\emph\{([^}]+)\}\}/g, '<div class="text-[12px] font-semibold italic text-slate-700 leading-snug">$1</div>');

  // Direct sizing with enclosing braces
  cleaned = cleaned.replace(/\{\s*\\Huge\s+([^}]+)\}/g, '<h1 class="text-[22px] font-bold tracking-wide text-slate-900 m-0 leading-tight mb-0.5">$1</h1>');
  cleaned = cleaned.replace(/\{\s*\\huge\s+([^}]+)\}/g, '<h2 class="text-[18px] font-bold tracking-tight text-slate-900 m-0 leading-tight mb-0.5">$1</h2>');
  cleaned = cleaned.replace(/\{\s*\\LARGE\s+([^}]+)\}/g, '<div class="text-[15px] font-bold text-slate-900 leading-snug">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\Large\s+([^}]+)\}/g, '<div class="text-[14px] font-semibold text-slate-900 leading-snug">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\large\s+([^}]+)\}/g, '<div class="text-[13px] font-semibold text-slate-800 leading-snug">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\small\s+([^}]+)\}/g, '<span class="text-[11px] text-slate-600 leading-normal">$1</span>');
  cleaned = cleaned.replace(/\{\s*\\footnotesize\s+([^}]+)\}/g, '<span class="text-[10.5px] text-slate-500 leading-normal">$1</span>');

  // Direct sizing without braces
  cleaned = cleaned.replace(/\\Huge\s+([^{}\\\n]+)/g, '<h1 class="text-[22px] font-bold tracking-wide text-slate-900 m-0 leading-tight mb-0.5">$1</h1>');
  cleaned = cleaned.replace(/\\huge\s+([^{}\\\n]+)/g, '<h2 class="text-[18px] font-bold tracking-tight text-slate-900 m-0 leading-tight mb-0.5">$1</h2>');
  cleaned = cleaned.replace(/\\LARGE\s+([^{}\\\n]+)/g, '<div class="text-[15px] font-bold text-slate-900 leading-snug">$1</div>');
  cleaned = cleaned.replace(/\\Large\s+([^{}\\\n]+)/g, '<div class="text-[14px] font-semibold text-slate-900 leading-snug">$1</div>');
  cleaned = cleaned.replace(/\\large\s+([^{}\\\n]+)/g, '<div class="text-[13px] font-semibold text-slate-800 leading-snug">$1</div>');
  cleaned = cleaned.replace(/\\small\s+([^{}\\\n]+)/g, '<span class="text-[11px] text-slate-600 leading-normal">$1</span>');

  // Text formatting
  cleaned = cleaned.replace(/\\textbf\{([^}]+)\}/g, '<strong class="font-bold text-slate-900">$1</strong>');
  cleaned = cleaned.replace(/\\textit\{([^}]+)\}/g, '<em class="italic text-slate-700">$1</em>');
  cleaned = cleaned.replace(/\\emph\{([^}]+)\}/g, '<em class="italic text-slate-700">$1</em>');
  cleaned = cleaned.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
  cleaned = cleaned.replace(/\\textsc\{([^}]+)\}/g, '<span class="uppercase tracking-wider text-[0.9em] font-medium">$1</span>');

  // Custom resume macros with compact, professional spacing
  cleaned = cleaned.replace(
    /\\resumeSubheading\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}/g,
    (_m, p1, p2, p3, p4) => `
      <div class="text-slate-900" style="margin-top: 4px; margin-bottom: 2px;">
        <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0; table-layout: fixed;">
          <tr style="line-height: 1.25;">
            <td style="text-align: left; font-weight: 700; font-size: 12.5px; color: #0f172a; padding: 0;">${p1}</td>
            <td style="text-align: right; font-weight: 500; font-size: 11px; color: #475569; padding: 0; white-space: nowrap; font-family: system-ui, sans-serif;">${p2}</td>
          </tr>
          <tr style="line-height: 1.25;">
            <td style="text-align: left; font-style: italic; font-size: 11.5px; color: #334155; padding: 0;">${p3}</td>
            <td style="text-align: right; font-style: normal; font-size: 11px; color: #64748b; padding: 0; white-space: nowrap;">${p4}</td>
          </tr>
        </table>
      </div>
    `
  );

  cleaned = cleaned.replace(
    /\\resumeProjectHeading\s*\{([^}]+)\}\s*\{([^}]*)\}/g,
    (_m, p1, p2) => `
      <div class="text-slate-900" style="margin-top: 4px; margin-bottom: 2px;">
        <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0; table-layout: fixed;">
          <tr style="line-height: 1.25;">
            <td style="text-align: left; font-weight: 600; font-size: 12.5px; color: #0f172a; padding: 0;">${p1}</td>
            <td style="text-align: right; font-weight: 500; font-size: 11px; color: #475569; padding: 0; white-space: nowrap; font-family: system-ui, sans-serif;">${p2}</td>
          </tr>
        </table>
      </div>
    `
  );

  cleaned = cleaned.replace(
    /\\resumeItem\{([^}]+)\}/g,
    (_m, text) => `<li class="text-[11.5px] leading-snug text-slate-800 break-words" style="margin-bottom: 1.5px;">${text}</li>`
  );

  // Section titles with professional solid divider
  cleaned = cleaned.replace(/\\section\*?\{([^}]+)\}/g, (_m, title) => {
    return `
      <div class="border-b-[1.5px] border-slate-900 pb-0.5" style="margin-top: 8px; margin-bottom: 3px;">
        <h3 class="text-[11.5px] font-bold uppercase tracking-wider text-slate-900 m-0 leading-none">
          ${title}
        </h3>
      </div>
    `;
  });

  // Centers (Candidate Header) - compact and elegant
  cleaned = cleaned.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, (_m, inner) => {
    const trimmedInner = inner.replace(/<br\s*\/?>\s*$/gi, '').replace(/^\s*<br\s*\/?>/gi, '').trim();
    return `<div class="text-center text-slate-900" style="margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #cbd5e1;">${trimmedInner}</div>`;
  });

  // TWO-COLUMN / MINIPAGE SUPPORT: Render as side-by-side table cells so columns NEVER overlap in preview or PDF!
  cleaned = cleaned.replace(
    /\\begin\{minipage\}(\[[^\]]*\])?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}\s*(\\hfill)?\s*\\begin\{minipage\}(\[[^\]]*\])?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}/g,
    (_m, _pos1, width1, col1, _hfill, _pos2, width2, col2) => {
      const getWidthStyle = (wStr: string) => {
        if (wStr.includes('0.3') || wStr.includes('0.25') || wStr.includes('0.35')) return '33%';
        if (wStr.includes('0.6') || wStr.includes('0.7') || wStr.includes('0.65')) return '67%';
        if (wStr.includes('0.5') || wStr.includes('0.48')) return '50%';
        return '50%';
      };

      const w1 = getWidthStyle(width1);
      const w2 = getWidthStyle(width2);

      return `
        <table style="width: 100%; border-collapse: collapse; margin: 3px 0; table-layout: fixed;">
          <tr>
            <td style="width: ${w1}; vertical-align: top; border-right: 1px solid #cbd5e1; padding-right: 12px; word-break: break-word;">
              ${col1}
            </td>
            <td style="width: ${w2}; vertical-align: top; padding-left: 12px; word-break: break-word;">
              ${col2}
            </td>
          </tr>
        </table>
      `;
    }
  );

  // Single minipage fallback
  cleaned = cleaned.replace(
    /\\begin\{minipage\}(\[[^\]]*\])?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}/g,
    (_m, _pos, _width, content) => `<div class="w-full my-0.5 min-w-0 break-words">${content}</div>`
  );

  // List environments - support both bulleted and unbulleted itemize (e.g. label={})
  cleaned = cleaned.replace(/\\resumeItemListStart/g, '<ul class="list-disc pl-4 space-y-0.5" style="margin-top: 1px; margin-bottom: 3px;">');
  cleaned = cleaned.replace(/\\resumeItemListEnd/g, '</ul>');
  cleaned = cleaned.replace(/\\resumeSubHeadingListStart/g, '<div style="margin-top: 2px; margin-bottom: 2px;">');
  cleaned = cleaned.replace(/\\resumeSubHeadingListEnd/g, '</div>');

  cleaned = cleaned.replace(/\\begin\{itemize\}(\[[^\]]*label\s*=\s*\{\}[^\]]*\])/g, '<div class="space-y-0.5 text-[11.5px] text-slate-800" style="margin-top: 2px; margin-bottom: 3px;">');
  cleaned = cleaned.replace(/\\begin\{itemize\}(\[[^\]]*\])?/g, '<ul class="list-disc pl-4 space-y-0.5 text-[11.5px] text-slate-800" style="margin-top: 2px; margin-bottom: 3px;">');
  cleaned = cleaned.replace(/\\end\{itemize\}/g, '</ul>');

  cleaned = cleaned.replace(/\\begin\{enumerate\}(\[[^\]]*\])?/g, '<ol class="list-decimal pl-4 space-y-0.5 text-[11.5px] text-slate-800" style="margin-top: 2px; margin-bottom: 3px;">');
  cleaned = cleaned.replace(/\\end\{enumerate\}/g, '</ol>');

  cleaned = cleaned.replace(/\\item\s+([^\n\\]+)/g, (_m, text) => {
    return `<li class="text-[11.5px] leading-snug text-slate-800 break-words" style="margin-bottom: 1.5px;">${text}</li>`;
  });

  // \hfill replacements inside text lines: using table layout for 100% reliable non-overlapping rendering in html2canvas!
  cleaned = cleaned.replace(/([^\\\n<]+)\\hfill\s*([^\n\\<]+)/g, (_m, left, right) => {
    const cleanLeft = left.trim();
    const cleanRight = right.trim();
    if (!cleanLeft && !cleanRight) return '';
    return `
      <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
        <tr>
          <td style="text-align: left; padding: 0; font-size: 11.5px; color: #0f172a; line-height: 1.25;">${cleanLeft}</td>
          <td style="text-align: right; padding: 0; font-size: 11px; color: #475569; font-family: system-ui, sans-serif; white-space: nowrap; line-height: 1.25;">${cleanRight}</td>
        </tr>
      </table>
    `;
  });

  // Horizontal rules
  cleaned = cleaned.replace(/\\noindent\\rule\{[^}]*\}\{[^}]*\}/g, '<hr class="border-t border-slate-700 my-1" style="margin: 3px 0;" />');
  cleaned = cleaned.replace(/\\rule\{[^}]*\}\{[^}]*\}/g, '<hr class="border-t border-slate-700 my-1" style="margin: 3px 0;" />');
  cleaned = cleaned.replace(/\\hrulefill/g, '<hr class="border-t border-slate-300 my-0.5" style="margin: 2px 0;" />');
  cleaned = cleaned.replace(/\\hrule/g, '<hr class="border-t border-slate-700 my-1" style="margin: 3px 0;" />');

  // Support explicit LaTeX page breaks (\newpage, \pagebreak, \clearpage)
  cleaned = cleaned.replace(/\\(newpage|pagebreak|clearpage)/g, '<div data-latex-page-break="true" style="display:none;"></div>');

  // Clean trailing \\ following closing block tags so we don't produce empty lines
  cleaned = cleaned.replace(/<\/table>\s*\\\\/g, '</table>');
  cleaned = cleaned.replace(/<\/div>\s*\\\\/g, '</div>');
  cleaned = cleaned.replace(/<\/h[1-6]>\s*\\\\/g, '');

  // Line breaks \\
  cleaned = cleaned.replace(/\\\\/g, '<br />');

  // Cleanup stray LaTeX macros safely (excluding html tags)
  cleaned = cleaned.replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?(\{([^}]*)\})?/g, (match) => {
    const innerMatch = match.match(/\{([^}]*)\}/);
    if (innerMatch) return innerMatch[1];
    return '';
  });

  // Remove stray curly braces
  cleaned = cleaned.replace(/\{([^{}<>]*)\}/g, '$1');

  // COLLAPSE GAPS: Clean up consecutive and redundant <br /> tags
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){2,}/gi, '<br />');
  cleaned = cleaned.replace(/(<\/(div|table|ul|ol|p|h[1-6]|hr)>)\s*<br\s*\/?>/gi, '$1');
  cleaned = cleaned.replace(/<br\s*\/?>\s*(<(div|table|ul|ol|p|h[1-6]|hr))/gi, '$1');

  // Remove empty block containers that create vertical gaps
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, '');

  return { html: cleaned, warnings };
}

/**
 * Splits parsed LaTeX HTML into standard A4 pages.
 * - Single-page guarantee: If the content fits within standard A4 printable height (<= 1030px),
 *   it returns exactly 1 single page.
 * - Extended content: If the text added in the LaTeX code is large and extends past the page
 *   (or uses explicit \newpage), it creates two separate pages with the extended text on Page 2,
 *   preserving 100% full width and two-column alignment without overlap or gaps.
 */
export function splitHtmlIntoA4Pages(fullHtml: string, maxPageHeightPx: number = 1030): string[] {
  if (!fullHtml || !fullHtml.trim()) {
    return [''];
  }

  // SSR fallback
  if (typeof document === 'undefined') {
    return [fullHtml];
  }

  // 1. Check for top-level explicit page break markers in LaTeX
  if (fullHtml.includes('data-latex-page-break="true"') && !fullHtml.includes('<table')) {
    const parts = fullHtml
      .split(/<div data-latex-page-break="true"[^>]*><\/div>/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (parts.length > 1) {
      return [parts[0], parts.slice(1).join('\n')];
    }
  }

  // 2. Offscreen measurement container replicating true A4 printable page styling
  const staging = document.createElement('div');
  staging.style.position = 'fixed';
  staging.style.top = '-20000px';
  staging.style.left = '-20000px';
  // Standard printable width: A4 width 794px minus 2 * 10mm padding (~76px) = ~718px
  staging.style.width = '718px';
  staging.style.fontFamily = "'Latin Modern Roman', 'Computer Modern', 'Times New Roman', Times, Georgia, serif";
  staging.style.fontSize = '12px';
  staging.style.lineHeight = 'normal';
  staging.style.boxSizing = 'border-box';
  staging.style.visibility = 'hidden';
  staging.innerHTML = fullHtml;
  document.body.appendChild(staging);

  const totalHeight = staging.offsetHeight;
  const hasPageBreak = !!staging.querySelector('[data-latex-page-break="true"]');

  // Single-page guarantee: If content fits within single A4 page height (1030px printable area)
  // and no explicit page break was requested, keep as 1 single page!
  if (totalHeight <= maxPageHeightPx && !hasPageBreak) {
    document.body.removeChild(staging);
    return [fullHtml];
  }

  // Helper to partition child elements of a container based on available vertical space
  const partitionContainer = (
    container: HTMLElement,
    targetHeight: number
  ): { page1Html: string; page2Html: string } => {
    let p1 = '';
    let p2 = '';
    let accumulated = 0;
    let hasSplit = false;

    const children = Array.from(container.children) as HTMLElement[];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const h = child.offsetHeight || 25;

      // Check for explicit page break in this child
      if (child.querySelector('[data-latex-page-break="true"]') || child.getAttribute('data-latex-page-break') === 'true') {
        hasSplit = true;
        continue;
      }

      if (!hasSplit) {
        // Prevent leaving orphan section headers at bottom of Page 1
        const isHeader = child.querySelector('h1, h2, h3') || child.tagName.startsWith('H');
        const remainingSpace = targetHeight - accumulated;
        if (isHeader && remainingSpace < 50 && accumulated > 100) {
          p2 += child.outerHTML;
          hasSplit = true;
          continue;
        }

        if (accumulated + h <= targetHeight) {
          p1 += child.outerHTML;
          accumulated += h;
        } else {
          // Can we split this child further if it contains multiple sub-elements?
          // (e.g. multiple jobs or bullet lists)
          if (
            child.children.length > 1 &&
            (child.classList.contains('space-y-1') ||
              child.classList.contains('space-y-1.5') ||
              child.tagName === 'UL' ||
              child.tagName === 'OL' ||
              child.tagName === 'DIV')
          ) {
            const subResult = partitionContainer(child, targetHeight - accumulated);
            if (subResult.page1Html.trim()) {
              const tag = child.tagName.toLowerCase();
              p1 += `<${tag} class="${child.className}" style="${child.getAttribute('style') || ''}">${subResult.page1Html}</${tag}>`;
            }
            if (subResult.page2Html.trim()) {
              const tag = child.tagName.toLowerCase();
              p2 += `<${tag} class="${child.className}" style="${child.getAttribute('style') || ''}">${subResult.page2Html}</${tag}>`;
            }
            hasSplit = true;
          } else {
            // First item fallback: avoid empty Page 1
            if (i === 0 && !p1.trim()) {
              p1 += child.outerHTML;
              accumulated += h;
            } else {
              p2 += child.outerHTML;
              hasSplit = true;
            }
          }
        }
      } else {
        p2 += child.outerHTML;
      }
    }

    return { page1Html: p1, page2Html: p2 };
  };

  // Check if it's a Two-Column resume
  const twoColTable = (staging.querySelector('table[style*="table-layout: fixed"]') ||
    staging.querySelector('table')) as HTMLTableElement | null;
  const isTwoCol = twoColTable && twoColTable.rows.length > 0 && twoColTable.rows[0].cells.length === 2;

  if (isTwoCol) {
    // Collect any header elements preceding the table (Name, contact info, rules)
    let headerHtml = '';
    let headerHeight = 0;
    const children = Array.from(staging.children);
    const tableIndex = children.indexOf(twoColTable);

    for (let i = 0; i < tableIndex; i++) {
      const child = children[i] as HTMLElement;
      headerHtml += child.outerHTML;
      headerHeight += child.offsetHeight || 25;
    }

    const availableHeight = Math.max(350, maxPageHeightPx - headerHeight - 15);

    const col1Cell = twoColTable.rows[0].cells[0];
    const col2Cell = twoColTable.rows[0].cells[1];
    const col1Width = col1Cell.style.width || '33%';
    const col2Width = col2Cell.style.width || '67%';

    const col1Result = partitionContainer(col1Cell, availableHeight);
    const col2Result = partitionContainer(col2Cell, availableHeight);

    // Any sibling elements after the table
    let footerHtml = '';
    for (let i = tableIndex + 1; i < children.length; i++) {
      footerHtml += (children[i] as HTMLElement).outerHTML;
    }

    document.body.removeChild(staging);

    if (!col1Result.page2Html.trim() && !col2Result.page2Html.trim()) {
      return [fullHtml];
    }

    const page1Html = `
      ${headerHtml}
      <table style="width: 100%; border-collapse: collapse; margin: 3px 0; table-layout: fixed;">
        <tr>
          <td style="width: ${col1Width}; vertical-align: top; border-right: 1px solid #cbd5e1; padding-right: 12px; word-break: break-word;">
            ${col1Result.page1Html}
          </td>
          <td style="width: ${col2Width}; vertical-align: top; padding-left: 12px; word-break: break-word;">
            ${col2Result.page1Html}
          </td>
        </tr>
      </table>
    `;

    const page2Html = `
      <table style="width: 100%; border-collapse: collapse; margin: 3px 0; table-layout: fixed;">
        <tr>
          <td style="width: ${col1Width}; vertical-align: top; border-right: 1px solid #cbd5e1; padding-right: 12px; word-break: break-word;">
            ${col1Result.page2Html || '&nbsp;'}
          </td>
          <td style="width: ${col2Width}; vertical-align: top; padding-left: 12px; word-break: break-word;">
            ${col2Result.page2Html}
          </td>
        </tr>
      </table>
      ${footerHtml}
    `;

    return [page1Html, page2Html];
  }

  // Single-Column resume partition
  const singleResult = partitionContainer(staging, maxPageHeightPx);
  document.body.removeChild(staging);

  if (!singleResult.page2Html.trim()) {
    return [fullHtml];
  }

  return [singleResult.page1Html, singleResult.page2Html];
}

