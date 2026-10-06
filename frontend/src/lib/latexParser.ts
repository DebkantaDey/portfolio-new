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
%------------------------

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
    \\textbf{\\Huge \\scshape Alex Morgan} \\\\ \\vspace{1pt}
    \\small +1 (415) 890-4211 $|$ \\href{mailto:alex@alexmorgan.dev}{\\underline{alex@alexmorgan.dev}} $|$ 
    \\href{https://linkedin.com/in/alexmorgan-dev}{\\underline{linkedin.com/in/alexmorgan}} $|$
    \\href{https://github.com/alexmorgan}{\\underline{github.com/alexmorgan}} $|$
    \\href{https://alexmorgan.dev}{\\underline{alexmorgan.dev}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {University of California, Berkeley}{Berkeley, CA}
      {Bachelor of Science in Computer Science, Magna Cum Laude}{Aug 2015 -- May 2019}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {Senior Full-Stack Architect}{Jan 2022 -- Present}
      {Nexus Cloud Systems}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Architected distributed microservices powering 10M+ daily events using Next.js 15, Node.js, and PostgreSQL.}
        \\resumeItem{Spearheaded migration to serverless edge computing, reducing p99 API latency by 42\\% and cloud costs by \\$180K/yr.}
        \\resumeItem{Mentored 12 mid-level and junior software engineers across three cross-functional agile engineering squads.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Lead Software Engineer}{Jun 2019 -- Dec 2021}
      {Vanguard Financial Technologies}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Built real-time cryptographic transaction auditing pipelines with zero downtime across 4 years of continuous operation.}
        \\resumeItem{Engineered performant React component system, boosting client page speed scores from 64 to 98 on Google Core Web Vitals.}
        \\resumeItem{Integrated automated CI/CD security pipelines using GitHub Actions, Docker, and Kubernetes clusters.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Featured Engineering Projects}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{Distributed Cache Fabric} $|$ \\emph{Go, Redis, gRPC, Docker, Prometheus}}{2024}
          \\resumeItemListStart
            \\resumeItem{High-performance in-memory caching layer handling 150K QPS with sub-millisecond p95 read latency.}
            \\resumeItem{Implemented distributed consensus algorithm and automatic cluster node failover routines.}
          \\resumeItemListEnd
      \\resumeProjectHeading
          {\\textbf{Modern Edge Portfolio CMS} $|$ \\emph{Next.js 15, TypeScript, TailwindCSS, PostgreSQL}}{2023}
          \\resumeItemListStart
            \\resumeItem{Full-stack production portfolio featuring instant live theme re-coloring, LaTeX parsing, and admin analytics.}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: TypeScript, JavaScript, Python, Go, SQL (PostgreSQL), HTML5, CSS3} \\\\
     \\textbf{Frameworks}{: Next.js, React, Node.js, Express, TailwindCSS, Prisma ORM, TRPC} \\\\
     \\textbf{Infrastructure}{: Docker, Kubernetes, AWS, Google Cloud Platform, GitHub Actions, CI/CD, Redis} \\\\
     \\textbf{Methodologies}{: Microservices Architecture, TDD, Clean Architecture, High-Throughput Distributed Systems}
    }}
 \\end{itemize}

\\end{document}
`,
  },

  deedy: {
    id: 'deedy',
    name: 'Deedy Modern (Two-Column Sidebar Layout)',
    category: 'two-column',
    badge: 'Two Column • Developer Favorite',
    description: 'The iconic two-column resume design with a 33% left sidebar for skills, education, and links, and 67% right column for career history.',
    code: `%-------------------------
% Deedy - Modern Two-Column Resume in LaTeX
%-------------------------
\\documentclass[letterpaper]{article}
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
    {\\Huge \\textbf{ALEX MORGAN}} \\\\
    \\vspace{2pt}
    {\\large \\textit{Senior Full-Stack Engineer \\& Distributed Systems Architect}} \\\\
    \\vspace{4pt}
    alex@alexmorgan.dev $|$ +1 (415) 890-4211 $|$ San Francisco, CA $|$ \\href{https://alexmorgan.dev}{alexmorgan.dev}
\\end{center}

\\noindent\\rule{\\textwidth}{1pt}

% Two Column Container
\\begin{minipage}[t]{0.32\\textwidth}

\\section{Contact}
San Francisco, CA \\\\
+1 (415) 890-4211 \\\\
alex@alexmorgan.dev \\\\
\\href{https://github.com/alexmorgan}{github.com/alexmorgan} \\\\
\\href{https://linkedin.com/in/alexmorgan}{linkedin.com/in/alexmorgan}

\\section{Education}
\\textbf{UC Berkeley} \\\\
B.S. in Computer Science \\\\
Magna Cum Laude \\\\
2015 -- 2019

\\section{Skills}
\\textbf{Languages} \\\\
TypeScript, JavaScript, \\\\
Python, Go, SQL, Bash \\\\
\\vspace{4pt}
\\textbf{Frameworks} \\\\
Next.js 15, React, \\\\
Node.js, Express, Tailwind \\\\
\\vspace{4pt}
\\textbf{Infrastructure} \\\\
Docker, Kubernetes, \\\\
AWS, GCP, PostgreSQL, \\\\
Redis, Kafka, CI/CD

\\section{Awards}
Dean's Honors List \\\\
Hackathon 1st Place (2022) \\\\
AWS Certified Architect

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.65\\textwidth}

\\section{Professional Experience}

\\textbf{Senior Full-Stack Architect} \\hfill Jan 2022 -- Present \\\\
\\textit{Nexus Cloud Systems} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Architected high-throughput microservices handling 10,000,000+ daily events with 99.99\\% uptime.
    \\item Decreased average API response times from 340ms to 45ms using Redis caching tiers and database replication.
    \\item Mentored 12 mid-level and junior engineers across three agile squads.
\\end{itemize}

\\vspace{4pt}
\\textbf{Lead Software Engineer} \\hfill Jun 2019 -- Dec 2021 \\\\
\\textit{Vanguard Financial Technologies} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Led frontend engineering migration to Next.js SSR, achieving 99.8\\% uptime and 100/100 Core Web Vitals.
    \\item Designed real-time event pipeline using Apache Kafka and PostgreSQL read replicas.
    \\item Supervised five full-stack engineers and automated end-to-end integration test suites.
\\end{itemize}

\\section{Featured Engineering Projects}

\\textbf{Distributed Cache Fabric} \\hfill Go, Redis, Docker
\\begin{itemize}
    \\item High-performance in-memory cache handling 150K QPS with sub-millisecond p95 latency.
    \\item Distributed consensus and automatic cluster failover routines.
\\end{itemize}

\\textbf{Modern Edge Portfolio CMS} \\hfill Next.js 15, PostgreSQL
\\begin{itemize}
    \\item Production portfolio with real-time style re-coloring and LaTeX compiler.
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
    {\\Large \\textbf{ALEX MORGAN}} \\\\
    \\vspace{3pt}
    Senior Full-Stack Architect $\\cdot$ Cloud Systems Engineer \\\\
    San Francisco, CA $\\cdot$ alex@alexmorgan.dev $\\cdot$ +1 (415) 890-4211 \\\\
    \\href{https://alexmorgan.dev}{https://alexmorgan.dev}
\\end{center}

\\noindent\\rule{\\textwidth}{0.8pt}

\\section*{PROFESSIONAL SUMMARY}
Software Architect with 8+ years designing fault-tolerant distributed platforms, high-performance Next.js applications, and microservices processing millions of daily transactions.

\\section*{PROFESSIONAL EXPERIENCE}

\\textbf{Senior Full-Stack Architect} \\hfill Jan 2022 -- Present \\\\
\\textit{Nexus Cloud Systems, San Francisco, CA}
\\begin{itemize}
    \\item Directed distributed infrastructure initiatives supporting 10,000,000+ daily analytical events.
    \\item Authored technical RFCs on zero-downtime database migrations and automated failover topologies.
    \\item Reduced p99 latency by 42\\% and cloud compute expenditure by \\$180,000 annually.
\\end{itemize}

\\textbf{Lead Software Engineer} \\hfill Jun 2019 -- Dec 2021 \\\\
\\textit{Vanguard Financial Technologies, San Francisco, CA}
\\begin{itemize}
    \\item Supervised team of six software developers building fault-tolerant fintech platforms.
    \\item Designed low-latency WebSocket communication engine handling 50,000 concurrent streaming connections.
\\end{itemize}

\\section*{EDUCATION}
\\textbf{University of California, Berkeley} \\hfill May 2019 \\\\
Bachelor of Science in Computer Science, Magna Cum Laude

\\section*{TECHNICAL PROFICIENCIES}
\\textbf{Programming:} TypeScript, JavaScript, Python, Go, SQL, Bash \\\\
\\textbf{Platforms:} PostgreSQL, Next.js, React, Node.js, Docker, Kubernetes, AWS, GCP

\\end{document}
`,
  },

  executive_split: {
    id: 'executive_split',
    name: 'Executive Slate (Two-Column Dark Accent)',
    category: 'two-column',
    badge: 'Two Column • Senior / Staff Roles',
    description: 'Distinguished executive layout with structured left column for credentials & leadership competencies, and wide right column for career milestones.',
    code: `%-------------------------
% Executive Slate Two-Column Resume in LaTeX
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
    {\\Huge \\textbf{ALEX MORGAN}} \\\\
    \\vspace{2pt}
    {\\large \\textbf{Staff Software Architect \\& Engineering Director}} \\\\
    \\vspace{4pt}
    San Francisco, CA $|$ alex@alexmorgan.dev $|$ +1 (415) 890-4211 $|$ \\href{https://alexmorgan.dev}{alexmorgan.dev}
\\end{center}

\\noindent\\rule{\\textwidth}{1.5pt}

% Two Column Body
\\begin{minipage}[t]{0.33\\textwidth}

\\section{Executive Focus}
\\begin{itemize}
    \\item Distributed Systems
    \\item Microservices Architecture
    \\item Engineering Leadership
    \\item Cloud Cost Optimization
\\end{itemize}

\\section{Education}
\\textbf{UC Berkeley} \\\\
B.S. in Computer Science \\\\
Magna Cum Laude \\\\
2015 -- 2019

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
AWS Certified Solutions Architect \\\\
CKA Kubernetes Administrator

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.64\\textwidth}

\\section{Leadership \\& Career Milestones}

\\textbf{Senior Full-Stack Architect} \\hfill 2022 -- Present \\\\
\\textit{Nexus Cloud Systems} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Led architecture for mission-critical distributed platform processing \\$40M+ annual volume.
    \\item Established architectural review board (ARB) and mentored 12 mid/senior developers.
    \\item Spearheaded edge-first infrastructure migration reducing monthly hosting bills by 35\\%.
\\end{itemize}

\\vspace{4pt}
\\textbf{Lead Software Engineer} \\hfill 2019 -- 2021 \\\\
\\textit{Vanguard Financial Technologies} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Directed engineering squad of 8 engineers delivering real-time fraud monitoring.
    \\item Achieved 100/100 Core Web Vitals on flagship web application through edge SSR.
    \\item Introduced end-to-end automated testing pipelines reducing regressions by 80\\%.
\\end{itemize}

\\section{Flagship Systems}
\\textbf{Distributed Cache Fabric} \\hfill Go, Redis, gRPC \\\\
High-throughput caching engine scaling to 150K requests per second with sub-ms p95 latency.

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
    {\\Huge \\textbf{Alex Morgan}} \\\\
    \\vspace{2pt}
    \\small Senior Full-Stack Engineer \\& Cloud Architect \\\\
    \\vspace{2pt}
    alex@alexmorgan.dev $|$ +1 (415) 890-4211 $|$ San Francisco, CA $|$ \\href{https://alexmorgan.dev}{alexmorgan.dev}
\\end{center}

\\section{Summary}
Senior software engineer with 8+ years designing and delivering high-throughput cloud architectures, deterministic TypeScript microservices, and high-performance Next.js web applications scaling to millions of daily requests.

\\section{Technical Proficiencies}
\\textbf{Languages:} TypeScript, JavaScript, Python, Go, SQL (PostgreSQL), HTML5, CSS3 \\\\
\\textbf{Frameworks \\& Libraries:} Next.js 15, React, Node.js, Express, TailwindCSS, Prisma ORM, TRPC \\\\
\\textbf{DevOps \\& Infrastructure:} Docker, Kubernetes, AWS, Google Cloud Platform, GitHub Actions, Redis

\\section{Work History}

\\textbf{Senior Full-Stack Architect} \\hfill Jan 2022 -- Present \\\\
\\textit{Nexus Cloud Systems} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Architected and launched resilient multi-tenant SaaS platform processing \\$40M+ annual transaction volume.
    \\item Decreased average API response times from 340ms to 45ms through distributed cache hierarchies.
    \\item Championed TypeScript type-safety standards across 14 backend and frontend microservices.
\\end{itemize}

\\vspace{3pt}
\\textbf{Lead Software Engineer} \\hfill Jun 2019 -- Dec 2021 \\\\
\\textit{Vanguard Financial Technologies} \\hfill San Francisco, CA
\\begin{itemize}
    \\item Led frontend engineering migration to Next.js SSR, achieving 99.8\\% uptime and 100/100 Core Web Vitals.
    \\item Designed real-time event pipeline using Apache Kafka and PostgreSQL read replicas.
    \\item Directly supervised 5 full-stack engineers and instituted automated integration test standards.
\\end{itemize}

\\section{Education}
\\textbf{University of California, Berkeley} \\hfill 2015 -- 2019 \\\\
Bachelor of Science in Computer Science, Magna Cum Laude

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
  const experiencesLatex = (data.experiences || [])
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
${bullets || `        \\resumeItem{Delivered critical software engineering milestones with high quality.}`}
      \\resumeItemListEnd`;
    })
    .join('\n\n');

  const educationsLatex = (data.educations || [])
    .map((edu) => {
      const dates = `${edu.startDate || ''} -- ${edu.endDate || ''}`.trim().replace(/^--\s*|\s*--$/g, '');
      const degreeStr = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
      return `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.grade ? `GPA: ${edu.grade}` : '')}}
      {${escapeLatex(degreeStr)}}{${dates || 'Completed'}}`;
    })
    .join('\n\n');

  const projectsLatex = (data.projects || [])
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
  (data.skills || []).forEach((s) => {
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
    \\textbf{\\Huge \\scshape ${escapeLatex(data.fullName || 'Alex Morgan')}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(data.phone || '+1 (415) 890-4211')} $|$ 
    \\href{mailto:${data.email || 'alex@alexmorgan.dev'}}{\\underline{${escapeLatex(data.email || 'alex@alexmorgan.dev')}}} $|$ 
    ${data.location ? `${escapeLatex(data.location)} $|$ ` : ''}
    \\href{${data.websiteUrl || data.portfolioUrl || 'https://alexmorgan.dev'}}{\\underline{portfolio}}
\\end{center}

${
  data.summary
    ? `%-----------SUMMARY-----------
\\section{Professional Summary}
${escapeLatex(data.summary)}
`
    : ''
}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experiencesLatex || '    \\resumeSubheading{Senior Engineer}{2022 -- Present}{Tech Company}{San Francisco, CA}'}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Featured Projects}
    \\resumeSubHeadingListStart
${projectsLatex}
    \\resumeSubHeadingListEnd

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${educationsLatex || '    \\resumeSubheading{University of California, Berkeley}{}{B.S. in Computer Science}{2019}'}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${skillsLatex || '     \\textbf{Languages}{: TypeScript, JavaScript, Python, Go, SQL} \\\\'}
    }}
 \\end{itemize}

\\end{document}
`;
}

function generateTwoColumnLatex(data: PortfolioResumeData): string {
  const skillsByCategory: Record<string, string[]> = {};
  (data.skills || []).forEach((s) => {
    const cat = s.category || 'Skills';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s.name);
  });

  const skillsListLatex = Object.entries(skillsByCategory)
    .map(
      ([cat, list]) =>
        `\\textbf{${escapeLatex(cat)}} \\\\\n${escapeLatex(list.join(', '))}\\\\\n\\vspace{4pt}`
    )
    .join('\n');

  const educationsSidebar = (data.educations || [])
    .map(
      (edu) =>
        `\\textbf{${escapeLatex(edu.institution)}} \\\\\n${escapeLatex(edu.degree)} ${
          edu.fieldOfStudy ? `in ${escapeLatex(edu.fieldOfStudy)}` : ''
        } \\\\\n${edu.grade ? `${escapeLatex(edu.grade)} \\\\\n` : ''}${edu.endDate || ''}\\\\\n\\vspace{4pt}`
    )
    .join('\n');

  const experiencesLatex = (data.experiences || [])
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

  const projectsLatex = (data.projects || [])
    .slice(0, 3)
    .map((p) => {
      const tech = (p.technologies || []).join(', ');
      return `\\textbf{${escapeLatex(p.title)}} ${tech ? `\\hfill \\textit{${escapeLatex(tech)}}` : ''} \\\\
${escapeLatex(p.shortDescription || '')}`;
    })
    .join('\n\n\\vspace{3pt}\n');

  return `%-------------------------
% Auto-Generated Two-Column Resume from Portfolio Data
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
    {\\Huge \\textbf{${escapeLatex(data.fullName || 'Alex Morgan')}}} \\\\
    \\vspace{2pt}
    {\\large \\textit{${escapeLatex(data.professionalTitle || 'Senior Full-Stack Architect')}}} \\\\
    \\vspace{3pt}
    ${data.location ? `${escapeLatex(data.location)} $|$ ` : ''}
    ${escapeLatex(data.email || 'alex@alexmorgan.dev')} $|$ 
    ${escapeLatex(data.phone || '+1 (415) 890-4211')} $|$ 
    \\href{${data.websiteUrl || data.portfolioUrl || 'https://alexmorgan.dev'}}{portfolio}
\\end{center}

\\noindent\\rule{\\textwidth}{1pt}

% Two Column Container
\\begin{minipage}[t]{0.32\\textwidth}

\\section{Contact}
${data.location ? `${escapeLatex(data.location)} \\\\\n` : ''}
${escapeLatex(data.phone || '')} \\\\
${escapeLatex(data.email || '')}

${
  data.summary
    ? `\\section{About}
${escapeLatex(data.summary)}
`
    : ''
}

\\section{Education}
${educationsSidebar || '\\textbf{University} \\\\ B.S. Degree'}

\\section{Skills}
${skillsListLatex || '\\textbf{Core Skills} \\\\ TypeScript, Node.js, SQL'}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.65\\textwidth}

\\section{Work Experience}
${experiencesLatex || '\\textbf{Software Engineer} \\hfill 2022 -- Present'}

\\section{Featured Projects}
${projectsLatex}

\\end{minipage}

\\end{document}
`;
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

  // Remove LaTeX comments
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

  // Remove LaTeX layout commands that must not render into text
  cleaned = cleaned.replace(/\\vspace\*?\{[^}]*\}/g, '<div class="h-1"></div>');
  cleaned = cleaned.replace(/\\hspace\*?\{[^}]*\}/g, '&nbsp;&nbsp;');
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

  // Strip \underline inside \href and parse links cleanly with break-all
  cleaned = cleaned.replace(/\\href\{([^}]+)\}\{\\underline\{([^}]+)\}\}/g, (_m, url, text) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline underline decoration-blue-300 break-all font-medium">${text}</a>`;
  });
  cleaned = cleaned.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, (_m, url, text) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline underline decoration-blue-300 break-all font-medium">${text}</a>`;
  });
  cleaned = cleaned.replace(/\\url\{([^}]+)\}/g, (_m, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline break-all font-medium">${url}</a>`;
  });

  // Nested font combinations & headings
  cleaned = cleaned.replace(/\\textbf\{\\Huge\s*\\scshape\s*([^}]+)\}/g, '<h1 class="text-2xl font-bold tracking-tight text-slate-900 uppercase m-0">$1</h1>');
  cleaned = cleaned.replace(/\\textbf\{\\Huge\s*([^}]+)\}/g, '<h1 class="text-2xl font-bold tracking-tight text-slate-900 m-0">$1</h1>');
  cleaned = cleaned.replace(/\{\s*\\Huge\s*\\textbf\{([^}]+)\}\}/g, '<h1 class="text-2xl font-bold tracking-tight text-slate-900 m-0">$1</h1>');
  cleaned = cleaned.replace(/\{\s*\\huge\s*\\textbf\{([^}]+)\}\}/g, '<h2 class="text-xl font-bold tracking-tight text-slate-900 m-0">$1</h2>');
  cleaned = cleaned.replace(/\{\s*\\large\s*\\textbf\{([^}]+)\}\}/g, '<div class="text-sm font-bold text-slate-900">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\large\s*\\textit\{([^}]+)\}\}/g, '<div class="text-sm font-semibold italic text-slate-700">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\large\s*\\emph\{([^}]+)\}\}/g, '<div class="text-sm font-semibold italic text-slate-700">$1</div>');

  // Direct sizing with enclosing braces
  cleaned = cleaned.replace(/\{\s*\\Huge\s+([^}]+)\}/g, '<h1 class="text-2xl font-bold tracking-tight text-slate-900 m-0">$1</h1>');
  cleaned = cleaned.replace(/\{\s*\\huge\s+([^}]+)\}/g, '<h2 class="text-xl font-bold tracking-tight text-slate-900 m-0">$1</h2>');
  cleaned = cleaned.replace(/\{\s*\\LARGE\s+([^}]+)\}/g, '<div class="text-lg font-bold text-slate-900">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\Large\s+([^}]+)\}/g, '<div class="text-base font-semibold text-slate-900">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\large\s+([^}]+)\}/g, '<div class="text-sm font-semibold text-slate-800">$1</div>');
  cleaned = cleaned.replace(/\{\s*\\small\s+([^}]+)\}/g, '<span class="text-xs text-slate-700">$1</span>');
  cleaned = cleaned.replace(/\{\s*\\footnotesize\s+([^}]+)\}/g, '<span class="text-[11px] text-slate-600">$1</span>');

  // Direct sizing without braces
  cleaned = cleaned.replace(/\\Huge\s+([^{}\\\n]+)/g, '<h1 class="text-2xl font-bold tracking-tight text-slate-900 m-0">$1</h1>');
  cleaned = cleaned.replace(/\\huge\s+([^{}\\\n]+)/g, '<h2 class="text-xl font-bold tracking-tight text-slate-900 m-0">$1</h2>');
  cleaned = cleaned.replace(/\\LARGE\s+([^{}\\\n]+)/g, '<div class="text-lg font-bold text-slate-900">$1</div>');
  cleaned = cleaned.replace(/\\Large\s+([^{}\\\n]+)/g, '<div class="text-base font-semibold text-slate-900">$1</div>');
  cleaned = cleaned.replace(/\\large\s+([^{}\\\n]+)/g, '<div class="text-sm font-semibold text-slate-800">$1</div>');
  cleaned = cleaned.replace(/\\small\s+([^{}\\\n]+)/g, '<span class="text-xs text-slate-700">$1</span>');

  // Text formatting
  cleaned = cleaned.replace(/\\textbf\{([^}]+)\}/g, '<strong class="font-bold text-slate-900">$1</strong>');
  cleaned = cleaned.replace(/\\textit\{([^}]+)\}/g, '<em class="italic text-slate-700">$1</em>');
  cleaned = cleaned.replace(/\\emph\{([^}]+)\}/g, '<em class="italic text-slate-700">$1</em>');
  cleaned = cleaned.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
  cleaned = cleaned.replace(/\\textsc\{([^}]+)\}/g, '<span class="uppercase tracking-wider text-[0.9em] font-medium">$1</span>');

  // Convert custom resume macros:
  cleaned = cleaned.replace(
    /\\resumeSubheading\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}/g,
    (_m, p1, p2, p3, p4) => `
      <div class="mt-2.5 mb-1">
        <div class="flex items-baseline justify-between gap-2 text-xs sm:text-sm font-bold text-slate-900 min-w-0">
          <span class="min-w-0 break-words">${p1}</span>
          <span class="font-normal text-slate-600 text-right shrink-0 ml-2 font-mono text-[11px]">${p2}</span>
        </div>
        <div class="flex items-baseline justify-between gap-2 text-xs text-slate-700 italic min-w-0">
          <span class="min-w-0 break-words">${p3}</span>
          <span class="font-normal text-slate-500 text-right shrink-0 ml-2 text-[11px]">${p4}</span>
        </div>
      </div>
    `
  );

  cleaned = cleaned.replace(
    /\\resumeProjectHeading\s*\{([^}]+)\}\s*\{([^}]*)\}/g,
    (_m, p1, p2) => `
      <div class="mt-2 mb-1 flex items-baseline justify-between gap-2 text-xs sm:text-sm min-w-0">
        <div class="font-semibold text-slate-900 min-w-0 break-words">${p1}</div>
        <div class="text-[11px] text-slate-600 font-mono shrink-0 ml-2">${p2}</div>
      </div>
    `
  );

  cleaned = cleaned.replace(
    /\\resumeItem\{([^}]+)\}/g,
    (_m, text) => `<li class="text-[12px] leading-relaxed text-slate-800 break-words">${text}</li>`
  );

  // Section titles with professional divider
  cleaned = cleaned.replace(/\\section\*?\{([^}]+)\}/g, (_m, title) => {
    return `
      <div class="mt-3.5 mb-1.5 border-b border-slate-900 pb-0.5">
        <h3 class="text-[12px] font-bold uppercase tracking-wider text-slate-900 m-0">
          ${title}
        </h3>
      </div>
    `;
  });

  // Centers
  cleaned = cleaned.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, (_m, inner) => {
    return `<div class="text-center space-y-1 mb-3 pb-2 border-b border-slate-200 text-slate-900">${inner}</div>`;
  });

  // TWO-COLUMN / MINIPAGE SUPPORT:
  // Match adjacent minipages and wrap them into a flex container!
  cleaned = cleaned.replace(
    /\\begin\{minipage\}(\[[^\]]*\])?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}\s*(\\hfill)?\s*\\begin\{minipage\}(\[[^\]]*\])?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}/g,
    (_m, _pos1, width1, col1, _hfill, _pos2, width2, col2) => {
      const getWidthClass = (wStr: string) => {
        if (wStr.includes('0.3') || wStr.includes('0.25') || wStr.includes('0.35')) return 'w-[30%]';
        if (wStr.includes('0.6') || wStr.includes('0.7') || wStr.includes('0.65')) return 'w-[67%]';
        if (wStr.includes('0.5') || wStr.includes('0.48')) return 'w-[48%]';
        return 'w-1/2';
      };

      const w1 = getWidthClass(width1);
      const w2 = getWidthClass(width2);

      return `
        <div class="flex gap-4 items-start justify-between w-full my-2 min-w-0">
          <div class="${w1} shrink-0 min-w-0 border-r border-slate-200 pr-3 break-words space-y-3">${col1}</div>
          <div class="${w2} shrink-0 min-w-0 break-words space-y-3">${col2}</div>
        </div>
      `;
    }
  );

  // Single minipage fallback if standalone
  cleaned = cleaned.replace(
    /\\begin\{minipage\}(\[[^\]]*\])?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}/g,
    (_m, _pos, _width, content) => `<div class="w-full my-1 min-w-0 break-words">${content}</div>`
  );

  // List environments
  cleaned = cleaned.replace(/\\resumeItemListStart/g, '<ul class="list-disc ml-4 space-y-0.5 my-1">');
  cleaned = cleaned.replace(/\\resumeItemListEnd/g, '</ul>');
  cleaned = cleaned.replace(/\\resumeSubHeadingListStart/g, '<div class="space-y-2">');
  cleaned = cleaned.replace(/\\resumeSubHeadingListEnd/g, '</div>');

  cleaned = cleaned.replace(/\\begin\{itemize\}(\[[^\]]*\])?/g, '<ul class="list-disc ml-4 space-y-0.5 my-1">');
  cleaned = cleaned.replace(/\\end\{itemize\}/g, '</ul>');
  cleaned = cleaned.replace(/\\begin\{enumerate\}(\[[^\]]*\])?/g, '<ol class="list-decimal ml-4 space-y-0.5 my-1">');
  cleaned = cleaned.replace(/\\end\{enumerate\}/g, '</ol>');

  cleaned = cleaned.replace(/\\item\s+([^\n\\]+)/g, (_m, text) => {
    return `<li class="text-[12px] leading-relaxed text-slate-800 break-words">${text}</li>`;
  });

  // \hfill replacements inside text lines
  cleaned = cleaned.replace(/([^\\\n]+)\\hfill\s*([^\n\\]+)/g, (_m, left, right) => {
    return `<div class="flex justify-between items-baseline gap-2 text-xs sm:text-sm min-w-0"><span class="min-w-0 break-words">${left}</span><span class="text-slate-600 font-mono text-[11px] shrink-0 ml-2">${right}</span></div>`;
  });

  // Horizontal rules
  cleaned = cleaned.replace(/\\noindent\\rule\{[^}]*\}\{[^}]*\}/g, '<hr class="border-t border-slate-700 my-2" />');
  cleaned = cleaned.replace(/\\rule\{[^}]*\}\{[^}]*\}/g, '<hr class="border-t border-slate-700 my-2" />');
  cleaned = cleaned.replace(/\\hrulefill/g, '<hr class="border-t border-slate-300 my-1" />');
  cleaned = cleaned.replace(/\\hrule/g, '<hr class="border-t border-slate-700 my-1.5" />');

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

  return { html: cleaned, warnings };
}
