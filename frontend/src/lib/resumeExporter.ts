// Resume Exporter Utility for PDF, DOCS, and Image formats
// Synchronized, High-DPI, Non-Overlapping Vector & Image Render Engine

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PortfolioResumeData } from './latexParser';

// Export DOM element as PDF (Full-Width, Single-Page or Multi-Page when extended)
export async function exportResumeAsPdf(
  elementId: string,
  filename: string = 'Resume.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume preview element with id "${elementId}" not found`);
  }

  // Get all target resume page elements (.resume-page sheets)
  const pageElements = Array.from(element.querySelectorAll('.resume-page')) as HTMLElement[];
  const targetPages = pageElements.length > 0 ? pageElements : [element];

  // Create an offscreen staging container with UNTRANSFORMED 100% true A4 scale
  // This completely eliminates CSS transform: scale(...) distortion and text overlapping
  const staging = document.createElement('div');
  staging.style.position = 'fixed';
  staging.style.top = '-20000px';
  staging.style.left = '-20000px';
  staging.style.width = '794px'; // Exact 210mm at standard 96 DPI
  staging.style.zIndex = '-9999';
  staging.style.transform = 'none';
  staging.style.margin = '0';
  staging.style.padding = '0';
  staging.style.backgroundColor = '#ffffff';
  document.body.appendChild(staging);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

  try {
    for (let pIdx = 0; pIdx < targetPages.length; pIdx++) {
      const targetPage = targetPages[pIdx];

      // If subsequent page (Page 2+), add new PDF page
      if (pIdx > 0) {
        pdf.addPage();
      }

      // Clone page cleanly into the isolated unscaled container
      const clone = targetPage.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      clone.style.border = 'none';
      clone.style.width = '794px';
      clone.style.minHeight = '1123px'; // 297mm in pixels
      clone.style.boxSizing = 'border-box';
      clone.style.backgroundColor = '#ffffff';

      // Remove any on-screen page badge elements that shouldn't appear in the printed PDF
      const badges = clone.querySelectorAll('.page-indicator-badge');
      badges.forEach((b) => b.remove());

      staging.innerHTML = '';
      staging.appendChild(clone);

      // Brief tick for font rendering and table calculation
      await new Promise((resolve) => setTimeout(resolve, 80));

      const canvas = await (html2canvas as any)(clone, {
        scale: 2.5, // 2.5x crisp resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL('image/png');
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

      // Full-width render: image spans the full 210mm width (0 to pdfWidth)
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight, undefined, 'FAST');
      } else {
        const scaleFactor = pdfHeight / imgHeight;
        const scaledWidth = pdfWidth * scaleFactor;
        const xOffset = (pdfWidth - scaledWidth) / 2;
        pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, pdfHeight, undefined, 'FAST');
      }
    }
  } finally {
    if (document.body.contains(staging)) {
      document.body.removeChild(staging);
    }
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
}

// Export raw LaTeX file (.tex) as a single downloadable file
export function exportLatexFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/x-tex;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.tex') ? filename : `${filename}.tex`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export DOM element as High-Resolution Image (PNG or JPEG)
export async function exportResumeAsImage(
  elementId: string,
  filename: string = 'Resume',
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume preview element with id "${elementId}" not found`);
  }

  // Find first page or target element
  const firstPage = (element.querySelector('.resume-page') as HTMLElement) || element;

  // Render via unscaled staging container to avoid transform artifacts
  const staging = document.createElement('div');
  staging.style.position = 'fixed';
  staging.style.top = '-20000px';
  staging.style.left = '-20000px';
  staging.style.width = '794px';
  staging.style.zIndex = '-9999';
  staging.style.transform = 'none';
  staging.style.backgroundColor = '#ffffff';
  document.body.appendChild(staging);

  try {
    const clone = firstPage.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.width = '794px';
    clone.style.minHeight = '1123px';
    clone.style.boxSizing = 'border-box';
    clone.style.backgroundColor = '#ffffff';

    const badges = clone.querySelectorAll('.page-indicator-badge');
    badges.forEach((b) => b.remove());

    staging.appendChild(clone);
    await new Promise((resolve) => setTimeout(resolve, 60));

    const canvas = await (html2canvas as any)(clone, {
      scale: 3, // Ultra-high 300 DPI
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
    });

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    if (document.body.contains(staging)) {
      document.body.removeChild(staging);
    }
  }
}

// Export structured resume as standard Microsoft Word / Google Docs document (.doc)
// Supports both Single Column and Two Column layouts with complete dummy structure
export function exportResumeAsDocx(
  data: PortfolioResumeData,
  filename: string = 'Resume',
  layout: 'single' | 'two-column' = 'single'
): void {
  const experiences = data.experiences && data.experiences.length > 0 ? data.experiences : [
    {
      title: 'Senior Full-Stack Architect',
      company: 'Nexus Cloud Systems',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Architected distributed microservices powering 40M+ daily telemetry events using Next.js 15, Node.js, and PostgreSQL.\nSpearheaded migration to serverless edge computing, reducing p99 API latency by 42% and cloud costs by $180K/yr.\nMentored 12 mid-level and junior software engineers across three agile squads.',
    },
    {
      title: 'Lead Software Engineer',
      company: 'Vanguard Financial Technologies',
      location: 'San Francisco, CA',
      startDate: '2020',
      endDate: '2022',
      current: false,
      description: 'Built real-time cryptographic transaction auditing pipelines with zero downtime across 2+ years of operation.\nEngineered performant React component system, boosting client page speed scores from 64 to 98 on Core Web Vitals.',
    },
  ];

  const educations = data.educations && data.educations.length > 0 ? data.educations : [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2014',
      endDate: '2018',
      grade: '3.89 / 4.00, Magna Cum Laude',
    },
  ];

  const projects = data.projects && data.projects.length > 0 ? data.projects : [
    {
      title: 'Distributed Cache Fabric',
      technologies: ['Go', 'Redis', 'gRPC', 'Docker'],
      shortDescription: 'High-performance in-memory caching layer handling 150K QPS with sub-millisecond p95 read latency.',
    },
    {
      title: 'AuraFlow Collaborative AI Workspace',
      technologies: ['Next.js 15', 'TypeScript', 'WebSockets', 'PostgreSQL'],
      shortDescription: 'Real-time collaborative workspace with conflict-free replicated data types and LLM task summarization.',
    },
  ];

  const experiencesHtml = experiences
    .map((exp) => {
      const dates = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate || 'Present'}`;
      const bullets = (exp.description || '')
        .split('\n')
        .map((b) => b.trim().replace(/^[•\-\*]\s*/, ''))
        .filter((b) => b.length > 0)
        .map((b) => `<li style="margin-bottom: 3pt; font-size: 10pt; color: #222;">${b}</li>`)
        .join('');

      return `
        <div style="margin-top: 6pt; margin-bottom: 8pt;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="text-align: left; font-size: 10.5pt; font-weight: bold; color: #111;">${exp.title}</td>
              <td style="text-align: right; font-size: 9.5pt; color: #555;">${dates}</td>
            </tr>
            <tr>
              <td style="text-align: left; font-size: 9.5pt; font-style: italic; color: #333;">${exp.company}</td>
              <td style="text-align: right; font-size: 9.5pt; color: #666;">${exp.location || 'Remote'}</td>
            </tr>
          </table>
          ${bullets ? `<ul style="margin: 3pt 0 0 16pt; padding: 0;">${bullets}</ul>` : ''}
        </div>
      `;
    })
    .join('');

  const educationsHtml = educations
    .map((edu) => {
      const dates = `${edu.startDate || ''} – ${edu.endDate || ''}`.trim().replace(/^–\s*|\s*–$/g, '');
      const degreeStr = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
      return `
        <div style="margin-top: 4pt; margin-bottom: 6pt;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="text-align: left; font-size: 10pt; font-weight: bold; color: #111;">${edu.institution}</td>
              <td style="text-align: right; font-size: 9pt; color: #555;">${dates || '2018'}</td>
            </tr>
            <tr>
              <td style="text-align: left; font-size: 9.5pt; color: #333;">${degreeStr}</td>
              <td style="text-align: right; font-size: 9pt; color: #666;">${edu.grade ? `GPA: ${edu.grade}` : ''}</td>
            </tr>
          </table>
        </div>
      `;
    })
    .join('');

  const projectsHtml = projects
    .slice(0, 4)
    .map((p) => {
      const tech = (p.technologies || []).join(', ');
      return `
        <div style="margin-top: 4pt; margin-bottom: 6pt;">
          <p style="margin: 0; font-size: 10pt; font-weight: bold; color: #111;">
            ${p.title} ${tech ? `<span style="font-weight: normal; font-size: 9pt; color: #555;"> | ${tech}</span>` : ''}
          </p>
          <p style="margin: 2pt 0 0 0; font-size: 9.5pt; color: #333;">
            ${p.shortDescription || ''}
          </p>
        </div>
      `;
    })
    .join('');

  const skillsByCategory: Record<string, string[]> = {};
  const skillList = data.skills && data.skills.length > 0 ? data.skills : [
    { name: 'TypeScript, JavaScript, Python, Go, SQL', category: 'Languages' },
    { name: 'Next.js 15, React, Node.js, Express, TailwindCSS', category: 'Frameworks' },
    { name: 'PostgreSQL, Redis, Apache Kafka, MongoDB', category: 'Databases' },
    { name: 'Docker, Kubernetes, AWS, Google Cloud Platform, CI/CD', category: 'DevOps & Cloud' },
  ];

  skillList.forEach((s) => {
    const cat = s.category || 'Technical Skills';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s.name);
  });

  const skillsHtml = Object.entries(skillsByCategory)
    .map(
      ([cat, list]) => `
      <p style="margin: 2pt 0; font-size: 9.5pt; line-height: 1.35;">
        <strong style="color: #111;">${cat}:</strong> <span style="color: #333;">${list.join(', ')}</span>
      </p>
    `
    )
    .join('');

  const contactItems = [
    data.phone || '+1 (415) 890-4211',
    data.email || 'alex@alexmorgan.dev',
    data.location || 'San Francisco, CA',
    data.linkedinUrl || 'https://linkedin.com/in/alexmorgan',
    data.githubUrl || 'https://github.com/alexmorgan',
    data.websiteUrl || 'https://alexmorgan.dev',
  ]
    .filter(Boolean)
    .join('  •  ');

  // Single Column or Two-Column body markup
  let bodyContent = '';

  if (layout === 'two-column') {
    bodyContent = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 8pt;">
        <tr>
          <!-- Left Column (34%) -->
          <td style="width: 34%; vertical-align: top; border-right: 1pt solid #cbd5e1; padding-right: 12pt;">
            <h2>Contact</h2>
            <p style="font-size: 9pt; line-height: 1.4; color: #334155;">
              Location: ${data.location || 'San Francisco, CA'}<br/>
              Phone: ${data.phone || '+1 (415) 890-4211'}<br/>
              Email: ${data.email || 'alex@alexmorgan.dev'}<br/>
              Portfolio: ${data.websiteUrl || 'https://alexmorgan.dev'}<br/>
              GitHub: ${data.githubUrl || 'https://github.com/alexmorgan'}<br/>
              LinkedIn: ${data.linkedinUrl || 'https://linkedin.com/in/alexmorgan'}
            </p>

            <h2>Profile</h2>
            <p style="font-size: 9pt; line-height: 1.35; color: #334155;">
              ${data.summary || 'Senior full-stack software engineer and cloud architect with 8+ years designing high-throughput microservices, distributed backends, and performant Next.js applications.'}
            </p>

            <h2>Education</h2>
            ${educationsHtml}

            <h2>Technical Skills</h2>
            <div style="font-size: 9pt;">
              ${skillsHtml}
            </div>
          </td>

          <!-- Right Column (66%) -->
          <td style="width: 66%; vertical-align: top; padding-left: 14pt;">
            <h2>Professional Experience</h2>
            ${experiencesHtml}

            <h2>Engineering Projects</h2>
            ${projectsHtml}
          </td>
        </tr>
      </table>
    `;
  } else {
    // Single Column flow
    bodyContent = `
      <h2>Professional Summary</h2>
      <p style="font-size: 9.5pt; color: #334155; line-height: 1.4; margin-bottom: 6pt;">
        ${data.summary || 'Senior full-stack software engineer and cloud architect with 8+ years designing high-throughput microservices, distributed backends, and performant Next.js applications.'}
      </p>

      <h2>Professional Experience</h2>
      ${experiencesHtml}

      <h2>Featured Engineering Projects</h2>
      ${projectsHtml}

      <h2>Education & Academic Credentials</h2>
      ${educationsHtml}

      <h2>Technical Proficiencies</h2>
      <div style="margin-top: 4pt;">
        ${skillsHtml}
      </div>
    `;
  }

  // Complete Word Document HTML with XML Mime wrapper
  const documentContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${data.fullName || 'Debkanta Dey'} Resume</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: A4 portrait;
            margin: 0.6in 0.6in 0.6in 0.6in;
            mso-header-margin: 0.3in;
            mso-footer-margin: 0.3in;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 10pt;
            line-height: 1.25;
            color: #1e293b;
          }
          h1 {
            font-size: 20pt;
            font-weight: bold;
            color: #0f172a;
            margin: 0 0 2pt 0;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
          }
          h2 {
            font-size: 11pt;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1pt solid #0f172a;
            padding-bottom: 2pt;
            margin-top: 10pt;
            margin-bottom: 4pt;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
          }
          p { margin: 0; }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 10pt;">
          <h1>${data.fullName || 'Debkanta Dey'}</h1>
          <p style="font-size: 11pt; color: #0284c7; font-weight: 600; margin-bottom: 3pt;">
            ${data.professionalTitle || 'Senior Full-Stack Architect & Cloud Systems Engineer'}
          </p>
          <p style="font-size: 9pt; color: #475569;">
            ${contactItems}
          </p>
        </div>

        ${bodyContent}
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', documentContent], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Print Resume Preview Element via Native Browser System Print Dialog
// Creates an isolated off-screen print frame containing ONLY the resume pages,
// completely omitting admin headers, sidebars, toolbars, and editor UI.
export function printResumeElement(
  elementId: string,
  title: string = 'Resume'
): void {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume preview element with id "${elementId}" not found`);
  }

  // Remove existing print frame if present
  const oldFrame = document.getElementById('resume-system-print-frame');
  if (oldFrame) {
    oldFrame.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'resume-system-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    throw new Error('Unable to access print frame document');
  }

  // Collect stylesheets and inline styles from the active document
  const headElements: string[] = [];
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    headElements.push(link.outerHTML);
  });
  document.querySelectorAll('style').forEach((style) => {
    headElements.push(style.outerHTML);
  });

  // Extract all target resume page sheets (.resume-page)
  const pageElements = Array.from(element.querySelectorAll('.resume-page')) as HTMLElement[];
  const targetPages = pageElements.length > 0 ? pageElements : [element];

  // Clone each page and remove screen-only UI elements
  const clonedPagesHtml = targetPages
    .map((page) => {
      const clone = page.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.page-indicator-badge').forEach((badge) => badge.remove());
      return clone.outerHTML;
    })
    .join('\n');

  const printCss = `
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-sizing: border-box !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #0f172a !important;
      width: 210mm !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .page-indicator-badge {
      display: none !important;
    }
    .resume-page {
      width: 210mm !important;
      max-width: 210mm !important;
      min-height: 297mm !important;
      margin: 0 auto !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      background: #ffffff !important;
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      overflow: visible !important;
    }
    .resume-page:last-child {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
  `;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Space+Grotesk:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/fonts.css" />
        ${headElements.join('\n')}
        <style>
          ${printCss}
        </style>
      </head>
      <body>
        ${clonedPagesHtml}
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('System print error:', e);
      window.print();
    } finally {
      setTimeout(() => {
        iframe.remove();
      }, 2000);
    }
  }, 400);
}

