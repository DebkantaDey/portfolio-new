// Shared Theme & Styling Helper for Server & Client Rendering

export const DEFAULT_SETTINGS: Record<string, string> = {
  // Brand & Identity
  siteName: 'Alex Morgan | Senior Full-Stack Engineer & Cloud Architect',
  brandName: 'Alex Morgan',
  brandRole: 'Senior Full-Stack Architect',
  availabilityStatus: 'Available for hire',

  // Theme & Colors
  primaryColor: '#00007B',
  accentColor: '#0F9A73',
  backgroundColor: '#ffffff',
  textColor: '#00007B',
  surfaceColor: '#f8fafd',
  fontFamily: 'Inter',

  // Hero Section
  heroHeadline: 'Alex Morgan',
  heroTitle: 'Senior Full-Stack Engineer & Cloud Architect',
  heroBio:
    'Architecting resilient distributed backends, high-performance Next.js web applications, and fault-tolerant cloud systems that scale to millions of requests.',
  heroTagline: 'main branch • 8+ years shipping code',
  heroCtaPrimary: 'Explore Case Studies',
  heroCtaSecondary: 'Download CV',
  heroCtaContact: 'Contact',

  // Contact & Location
  contactEmail: 'alex@alexmorgan.dev',
  contactPhone: '+1 (415) 890-4211',
  location: 'San Francisco, CA (Open to Worldwide Remote)',

  // Footer
  footerBio:
    'Staff Full-Stack Software Engineer & Cloud Systems Architect. Crafting deterministic, fault-tolerant web applications and high-throughput microservices.',
  footerCopyright: `© ${new Date().getFullYear()} Alex Morgan. Built with Next.js, Node.js & PostgreSQL.`,
  footerStatusText: 'All services online',

  // SEO & Advanced
  seoMetaDescription:
    'Production portfolio of Alex Morgan. Specializing in Next.js 15, TypeScript, Node.js, PostgreSQL, Docker, and distributed systems architecture.',
  seoKeywords:
    'Alex Morgan, Full-Stack Developer, Software Architect, Next.js, TypeScript, Node.js, PostgreSQL, Cloud Architecture',
  googleAnalyticsId: '',
  maintenanceMode: 'false',
};

export const FONT_MAP: Record<string, string> = {
  Inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  'Plus Jakarta Sans': "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  Outfit: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  Poppins: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  Roboto: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  'Space Grotesk': "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  'Fira Code': "'Fira Code', 'Courier New', monospace",
  'JetBrains Mono': "'JetBrains Mono', 'Courier New', monospace",
  System: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export function hexToRgba(hexColor: string, alpha: number): string {
  if (!hexColor || typeof hexColor !== 'string') return `rgba(15, 154, 115, ${alpha})`;
  let clean = hexColor.trim().replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return `rgba(15, 154, 115, ${alpha})`;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(15, 154, 115, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getContrastColor(hexColor: string): string {
  if (!hexColor || typeof hexColor !== 'string') return '#ffffff';
  let clean = hexColor.trim().replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return '#ffffff';
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#ffffff';
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#0B1F3A' : '#ffffff';
}

export function isDarkColor(hexColor: string): boolean {
  if (!hexColor || typeof hexColor !== 'string') return false;
  let clean = hexColor.trim().replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140;
}

export function getGoogleFontUrl(fontName: string): string | null {
  if (!fontName || fontName === 'System') return null;
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontName
  )}:wght@300;400;500;600;700;800;900&display=swap`;
}

export function generateThemeCSS(settings: Record<string, string>): string {
  const currentMap = { ...DEFAULT_SETTINGS, ...settings };

  const primaryColor = currentMap.primaryColor || DEFAULT_SETTINGS.primaryColor;
  const accentColor = currentMap.accentColor || DEFAULT_SETTINGS.accentColor;
  const backgroundColor = currentMap.backgroundColor || DEFAULT_SETTINGS.backgroundColor;
  const textColor = currentMap.textColor || DEFAULT_SETTINGS.textColor;
  const surfaceColor = currentMap.surfaceColor || DEFAULT_SETTINGS.surfaceColor;
  const fontName = currentMap.fontFamily || DEFAULT_SETTINGS.fontFamily;
  const fontCss = FONT_MAP[fontName] || FONT_MAP['Inter'];

  const primaryContrast = getContrastColor(primaryColor);
  const accentContrast = getContrastColor(accentColor);
  const isDarkCanvas = isDarkColor(backgroundColor);

  return `
    :root {
      --primary-color: ${primaryColor} !important;
      --primary-navy: ${primaryColor} !important;
      --accent-color: ${accentColor} !important;
      --accent-cyan: ${accentColor} !important;
      --background: ${backgroundColor} !important;
      --background-color: ${backgroundColor} !important;
      --foreground: ${textColor} !important;
      --text-color: ${textColor} !important;
      --surface-color: ${surfaceColor} !important;
      --site-surface: ${surfaceColor} !important;
      --primary-contrast: ${primaryContrast} !important;
      --accent-contrast: ${accentContrast} !important;
      --border-subtle: ${hexToRgba(primaryColor, 0.15)} !important;
    }

    body {
      background-color: ${backgroundColor} !important;
      color: ${textColor} !important;
      font-family: ${fontCss} !important;
    }

    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: ${fontCss} !important;
    }

    ${
      isDarkCanvas
        ? `
      /* Adapt white sections and cards on dark canvas */
      main, section.bg-white {
        background-color: ${backgroundColor} !important;
      }
      .bg-white:not([data-preserve-white]) {
        background-color: ${surfaceColor} !important;
      }
      nav.bg-white\\/95, nav.bg-white\\/80, header.bg-white\\/95, header.bg-white\\/80 {
        background-color: ${hexToRgba(backgroundColor, 0.95)} !important;
      }
    `
        : ''
    }

    /* Subtle card containers */
    [class*="bg-[#f8fafd]"], [class*="bg-[#f0f4fc]"] {
      background-color: ${surfaceColor} !important;
    }

    /* --- SOLID BACKGROUNDS (Exact match using ~= so slash opacities are NOT touched) --- */
    [class~="bg-[#0F9A73]"] {
      background-color: ${accentColor} !important;
      color: ${accentContrast} !important;
    }
    [class~="bg-[#0F9A73]"] * {
      color: ${accentContrast} !important;
    }
    [class~="bg-[#0F9A73]"] svg {
      color: ${accentContrast} !important;
      stroke: ${accentContrast} !important;
    }

    [class~="bg-[#00007B]"] {
      background-color: ${primaryColor} !important;
      color: ${primaryContrast} !important;
    }
    [class~="bg-[#00007B]"] p,
    [class~="bg-[#00007B]"] h1,
    [class~="bg-[#00007B]"] h2,
    [class~="bg-[#00007B]"] h3,
    [class~="bg-[#00007B]"] h4 {
      color: ${primaryContrast} !important;
    }

    /* --- TINTED ACCENT CONTAINERS & BADGES (Preserve transparency so text/icons are vivid) --- */
    [class*="bg-[#0F9A73]/5"] {
      background-color: ${hexToRgba(accentColor, 0.08)} !important;
    }
    [class*="bg-[#0F9A73]/10"] {
      background-color: ${hexToRgba(accentColor, 0.12)} !important;
    }
    [class*="bg-[#0F9A73]/15"] {
      background-color: ${hexToRgba(accentColor, 0.16)} !important;
    }
    [class*="bg-[#0F9A73]/20"] {
      background-color: ${hexToRgba(accentColor, 0.22)} !important;
    }
    [class*="bg-[#0F9A73]/30"] {
      background-color: ${hexToRgba(accentColor, 0.30)} !important;
    }
    [class*="bg-[#0F9A73]/40"] {
      background-color: ${hexToRgba(accentColor, 0.40)} !important;
    }

    /* Text & Icons inside tinted accent containers */
    [class*="bg-[#0F9A73]/"] {
      color: ${accentColor} !important;
    }
    [class*="bg-[#0F9A73]/"] svg {
      color: ${accentColor} !important;
      stroke: currentColor !important;
    }
    [class*="bg-[#0F9A73]/"] span:not([class*="bg-"]) {
      color: ${accentColor} !important;
    }

    /* --- TINTED PRIMARY/NAVY CONTAINERS & BADGES --- */
    [class*="bg-[#00007B]/5"] {
      background-color: ${hexToRgba(primaryColor, 0.06)} !important;
    }
    [class*="bg-[#00007B]/10"] {
      background-color: ${hexToRgba(primaryColor, 0.12)} !important;
    }
    [class*="bg-[#00007B]/15"] {
      background-color: ${hexToRgba(primaryColor, 0.18)} !important;
    }
    [class*="bg-[#00007B]/20"] {
      background-color: ${hexToRgba(primaryColor, 0.24)} !important;
    }
    [class*="bg-[#00007B]/40"] {
      background-color: ${hexToRgba(primaryColor, 0.40)} !important;
    }
    [class*="bg-[#00007B]/50"] {
      background-color: ${hexToRgba(primaryColor, 0.50)} !important;
    }

    /* Text & Icons inside tinted primary containers */
    [class*="bg-[#00007B]/"] {
      color: ${textColor} !important;
    }
    [class*="bg-[#00007B]/"] svg:not([class*="text-[#0F9A73]"]):not([class*="text-amber"]) {
      color: ${textColor} !important;
      stroke: currentColor !important;
    }

    /* --- TEXT COLOR OVERRIDES --- */
    [class~="text-[#00007B]"] {
      color: ${textColor} !important;
    }
    [class*="text-[#00007B]/60"] {
      color: ${hexToRgba(textColor, 0.65)} !important;
    }
    [class*="text-[#00007B]/70"] {
      color: ${hexToRgba(textColor, 0.75)} !important;
    }
    [class*="text-[#00007B]/80"] {
      color: ${hexToRgba(textColor, 0.85)} !important;
    }
    [class*="text-[#00007B]/85"] {
      color: ${hexToRgba(textColor, 0.88)} !important;
    }
    [class*="text-[#00007B]/90"] {
      color: ${hexToRgba(textColor, 0.95)} !important;
    }

    [class~="text-[#0F9A73]"] {
      color: ${accentColor} !important;
    }

    /* --- BORDERS --- */
    [class*="border-[#00007B]/10"] {
      border-color: ${hexToRgba(primaryColor, 0.10)} !important;
    }
    [class*="border-[#00007B]/15"] {
      border-color: ${hexToRgba(primaryColor, 0.15)} !important;
    }
    [class*="border-[#00007B]/20"] {
      border-color: ${hexToRgba(primaryColor, 0.20)} !important;
    }
    [class*="border-[#00007B]/30"] {
      border-color: ${hexToRgba(primaryColor, 0.30)} !important;
    }
    [class~="border-[#00007B]"] {
      border-color: ${hexToRgba(primaryColor, 0.25)} !important;
    }

    [class*="border-[#0F9A73]/20"] {
      border-color: ${hexToRgba(accentColor, 0.25)} !important;
    }
    [class*="border-[#0F9A73]/30"] {
      border-color: ${hexToRgba(accentColor, 0.35)} !important;
    }
    [class*="border-[#0F9A73]/40"] {
      border-color: ${hexToRgba(accentColor, 0.45)} !important;
    }
    [class*="border-[#0F9A73]/50"] {
      border-color: ${hexToRgba(accentColor, 0.55)} !important;
    }
    [class~="border-[#0F9A73]"] {
      border-color: ${accentColor} !important;
    }

    ::selection {
      background: ${accentColor} !important;
      color: ${accentContrast} !important;
    }

    ::-webkit-scrollbar-thumb {
      background: ${primaryColor} !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${accentColor} !important;
    }
  `;
}
