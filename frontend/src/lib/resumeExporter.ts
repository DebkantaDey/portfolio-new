// Resume Exporter Utility for PDF, DOCS, and Image formats

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PortfolioResumeData } from './latexParser';

// Export DOM element as PDF
export async function exportResumeAsPdf(
  elementId: string,
  filename: string = 'Resume.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume preview element with id "${elementId}" not found`);
  }

  // Capture element at high DPI
  const canvas = await (html2canvas as any)(element, {
    scale: 2.5, // 2.5x resolution for crisp, sharp text and lines
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate scaled height to fit A4 width
  const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

  // If content fits within a single page
  if (imgHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
  } else {
    // Multi-page handling
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
}

// Export DOM element as Image (PNG or JPEG)
export async function exportResumeAsImage(
  elementId: string,
  filename: string = 'Resume',
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume preview element with id "${elementId}" not found`);
  }

  const canvas = await (html2canvas as any)(element, {
    scale: 3, // Ultra-high resolution
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export structured resume as standard Microsoft Word / Google Docs document (.doc)
// Supports both Single Column and Two Column layouts
export function exportResumeAsDocx(
  data: PortfolioResumeData,
  filename: string = 'Resume',
  layout: 'single' | 'two-column' = 'single'
): void {
  const experiencesHtml = (data.experiences || [])
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

  const educationsHtml = (data.educations || [])
    .map((edu) => {
      const dates = `${edu.startDate || ''} – ${edu.endDate || ''}`.trim().replace(/^–\s*|\s*–$/g, '');
      const degreeStr = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
      return `
        <div style="margin-top: 4pt; margin-bottom: 6pt;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="text-align: left; font-size: 10pt; font-weight: bold; color: #111;">${edu.institution}</td>
              <td style="text-align: right; font-size: 9pt; color: #555;">${dates}</td>
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

  const projectsHtml = (data.projects || [])
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
  (data.skills || []).forEach((s) => {
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
    data.phone,
    data.email,
    data.location,
    data.linkedinUrl ? 'LinkedIn' : null,
    data.githubUrl ? 'GitHub' : null,
    data.websiteUrl ? 'Portfolio' : null,
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
              ${data.location ? `${data.location}<br/>` : ''}
              ${data.phone ? `${data.phone}<br/>` : ''}
              ${data.email ? `${data.email}<br/>` : ''}
              ${data.websiteUrl ? `<a href="${data.websiteUrl}">Portfolio</a><br/>` : ''}
              ${data.githubUrl ? `<a href="${data.githubUrl}">GitHub</a><br/>` : ''}
              ${data.linkedinUrl ? `<a href="${data.linkedinUrl}">LinkedIn</a>` : ''}
            </p>

            ${
              data.summary
                ? `
              <h2>Profile</h2>
              <p style="font-size: 9pt; line-height: 1.35; color: #334155;">
                ${data.summary}
              </p>
            `
                : ''
            }

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
      ${
        data.summary
          ? `
        <h2>Professional Summary</h2>
        <p style="font-size: 9.5pt; color: #334155; line-height: 1.4; margin-bottom: 6pt;">
          ${data.summary}
        </p>
      `
          : ''
      }

      ${
        experiencesHtml
          ? `
        <h2>Professional Experience</h2>
        ${experiencesHtml}
      `
          : ''
      }

      ${
        projectsHtml
          ? `
        <h2>Featured Engineering Projects</h2>
        ${projectsHtml}
      `
          : ''
      }

      ${
        educationsHtml
          ? `
        <h2>Education & Academic Credentials</h2>
        ${educationsHtml}
      `
          : ''
      }

      ${
        skillsHtml
          ? `
        <h2>Technical Proficiencies</h2>
        <div style="margin-top: 4pt;">
          ${skillsHtml}
        </div>
      `
          : ''
      }
    `;
  }

  // Complete Word Document HTML with XML Mime wrapper
  const documentContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${data.fullName} Resume</title>
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
          <h1>${data.fullName}</h1>
          <p style="font-size: 11pt; color: #0284c7; font-weight: 600; margin-bottom: 3pt;">
            ${data.professionalTitle}
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
