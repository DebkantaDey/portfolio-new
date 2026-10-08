// Shared Theme & Styling Helper for Server & Client Rendering

export const DEFAULT_SETTINGS: Record<string, string> = {
  // Brand & Identity
  siteName: 'Debkanta Dey | Senior Full-Stack Engineer & Cloud Architect',
  brandName: 'Debkanta Dey',
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
  heroHeadline: 'Debkanta Dey',
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
  footerCopyright: `© ${new Date().getFullYear()} Debkanta Dey. Built with Next.js, Node.js & PostgreSQL.`,
  footerStatusText: 'All services online',

  // SEO & Advanced
  seoMetaDescription:
    'Production portfolio of Debkanta Dey. Specializing in Next.js 15, TypeScript, Node.js, PostgreSQL, Docker, and distributed systems architecture.',
  seoKeywords:
    'Debkanta Dey, Full-Stack Developer, Software Architect, Next.js, TypeScript, Node.js, PostgreSQL, Cloud Architecture',
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

  const darkBg = isDarkCanvas ? backgroundColor : '#0a0e1a';
  const darkFg = !isDarkColor(textColor) ? textColor : '#f8fafc';
  const darkSurface = isDarkColor(surfaceColor) ? surfaceColor : '#111827';
  const darkSurfaceMuted = '#162036';

  return `
    :root:not(.dark) {
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
      color-scheme: light;
    }

    html.dark, .dark {
      --primary-color: ${primaryColor} !important;
      --primary-navy: ${primaryColor} !important;
      --accent-color: ${accentColor} !important;
      --accent-cyan: ${accentColor} !important;
      --background: ${darkBg} !important;
      --background-color: ${darkBg} !important;
      --foreground: ${darkFg} !important;
      --text-color: ${darkFg} !important;
      --surface-color: ${darkSurface} !important;
      --site-surface: ${darkSurface} !important;
      --primary-contrast: ${primaryContrast} !important;
      --accent-contrast: ${accentContrast} !important;
      --border-subtle: rgba(255, 255, 255, 0.12) !important;
      color-scheme: dark;
    }

    body {
      font-family: ${fontCss} !important;
    }

    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: ${fontCss} !important;
    }

    /* ========================================================================= */
    /* UNIVERSAL ACCENT & PRIMARY BRAND RULES (Light & Dark)                     */
    /* ========================================================================= */
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
    [class~="bg-[#00007B]"] h4,
    [class~="bg-[#00007B]"] span {
      color: ${primaryContrast} !important;
    }
    [class~="bg-[#00007B]"] svg:not([class*="text-[#0F9A73]"]) {
      color: ${primaryContrast} !important;
      stroke: currentColor !important;
    }

    [class~="text-[#0F9A73]"], [class*="text-[#0F9A73]"] {
      color: ${accentColor} !important;
    }
    [class~="border-[#0F9A73]"] {
      border-color: ${accentColor} !important;
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

    [class*="hover:border-[#0F9A73]"]:hover {
      border-color: ${accentColor} !important;
    }
    [class*="hover:text-[#0F9A73]"]:hover {
      color: ${accentColor} !important;
    }
    [class*="focus:ring-[#0F9A73]"]:focus {
      --tw-ring-color: ${accentColor} !important;
    }
    [class*="focus:border-[#0F9A73]"]:focus {
      border-color: ${accentColor} !important;
    }

    ::selection {
      background: ${accentColor} !important;
      color: ${accentContrast} !important;
    }

    /* ========================================================================= */
    /* LIGHT MODE RULES                                                          */
    /* ========================================================================= */
    html:not(.dark) body {
      background-color: ${backgroundColor} !important;
      color: ${textColor} !important;
    }

    html:not(.dark) main,
    html:not(.dark) section.bg-white,
    html:not(.dark) div.bg-white.min-h-screen,
    html:not(.dark) div.bg-white.pt-32 {
      background-color: ${backgroundColor} !important;
    }

    html:not(.dark) [class*="bg-[#f8fafd]"],
    html:not(.dark) [class*="bg-[#f0f4fc]"] {
      background-color: ${surfaceColor} !important;
    }

    html:not(.dark) nav.bg-white\\/95,
    html:not(.dark) nav.bg-white\\/80,
    html:not(.dark) header.bg-white\\/95,
    html:not(.dark) header.bg-white\\/80 {
      background-color: ${hexToRgba(backgroundColor, 0.95)} !important;
    }

    html:not(.dark) [class*="bg-[#0F9A73]/5"] {
      background-color: ${hexToRgba(accentColor, 0.08)} !important;
    }
    html:not(.dark) [class*="bg-[#0F9A73]/10"] {
      background-color: ${hexToRgba(accentColor, 0.12)} !important;
    }
    html:not(.dark) [class*="bg-[#0F9A73]/15"] {
      background-color: ${hexToRgba(accentColor, 0.16)} !important;
    }
    html:not(.dark) [class*="bg-[#0F9A73]/20"] {
      background-color: ${hexToRgba(accentColor, 0.22)} !important;
    }
    html:not(.dark) [class*="bg-[#0F9A73]/30"] {
      background-color: ${hexToRgba(accentColor, 0.30)} !important;
    }
    html:not(.dark) [class*="bg-[#0F9A73]/40"] {
      background-color: ${hexToRgba(accentColor, 0.40)} !important;
    }

    html:not(.dark) [class*="bg-[#0F9A73]/"] {
      color: ${accentColor} !important;
    }
    html:not(.dark) [class*="bg-[#0F9A73]/"] svg {
      color: ${accentColor} !important;
      stroke: currentColor !important;
    }
    html:not(.dark) [class*="bg-[#0F9A73]/"] span:not([class*="bg-"]) {
      color: ${accentColor} !important;
    }

    html:not(.dark) [class*="bg-[#00007B]/5"] {
      background-color: ${hexToRgba(primaryColor, 0.06)} !important;
    }
    html:not(.dark) [class*="bg-[#00007B]/10"] {
      background-color: ${hexToRgba(primaryColor, 0.12)} !important;
    }
    html:not(.dark) [class*="bg-[#00007B]/15"] {
      background-color: ${hexToRgba(primaryColor, 0.18)} !important;
    }
    html:not(.dark) [class*="bg-[#00007B]/20"] {
      background-color: ${hexToRgba(primaryColor, 0.24)} !important;
    }
    html:not(.dark) [class*="bg-[#00007B]/40"] {
      background-color: ${hexToRgba(primaryColor, 0.40)} !important;
    }
    html:not(.dark) [class*="bg-[#00007B]/50"] {
      background-color: ${hexToRgba(primaryColor, 0.50)} !important;
    }

    html:not(.dark) [class*="bg-[#00007B]/"] {
      color: ${textColor} !important;
    }
    html:not(.dark) [class*="bg-[#00007B]/"] svg:not([class*="text-[#0F9A73]"]):not([class*="text-amber"]) {
      color: ${textColor} !important;
      stroke: currentColor !important;
    }

    html:not(.dark) [class~="text-[#00007B]"] {
      color: ${textColor} !important;
    }
    html:not(.dark) [class*="text-[#00007B]/60"] {
      color: ${hexToRgba(textColor, 0.65)} !important;
    }
    html:not(.dark) [class*="text-[#00007B]/70"] {
      color: ${hexToRgba(textColor, 0.75)} !important;
    }
    html:not(.dark) [class*="text-[#00007B]/75"] {
      color: ${hexToRgba(textColor, 0.78)} !important;
    }
    html:not(.dark) [class*="text-[#00007B]/80"] {
      color: ${hexToRgba(textColor, 0.85)} !important;
    }
    html:not(.dark) [class*="text-[#00007B]/85"] {
      color: ${hexToRgba(textColor, 0.88)} !important;
    }
    html:not(.dark) [class*="text-[#00007B]/90"] {
      color: ${hexToRgba(textColor, 0.95)} !important;
    }

    html:not(.dark) [class*="border-[#00007B]/10"] {
      border-color: ${hexToRgba(primaryColor, 0.10)} !important;
    }
    html:not(.dark) [class*="border-[#00007B]/15"] {
      border-color: ${hexToRgba(primaryColor, 0.15)} !important;
    }
    html:not(.dark) [class*="border-[#00007B]/20"] {
      border-color: ${hexToRgba(primaryColor, 0.20)} !important;
    }
    html:not(.dark) [class*="border-[#00007B]/30"] {
      border-color: ${hexToRgba(primaryColor, 0.30)} !important;
    }
    html:not(.dark) [class~="border-[#00007B]"] {
      border-color: ${hexToRgba(primaryColor, 0.25)} !important;
    }

    /* ========================================================================= */
    /* DARK MODE RULES                                                           */
    /* ========================================================================= */
    html.dark body {
      background-color: ${darkBg} !important;
      color: ${darkFg} !important;
    }

    html.dark main {
      background-color: ${darkBg} !important;
    }

    html.dark section.bg-white,
    html.dark section[class*="bg-white"],
    html.dark div.bg-white.min-h-screen,
    html.dark div.bg-white.pt-32,
    html.dark div[class*="min-h-screen bg-white"] {
      background-color: ${darkBg} !important;
    }

    html.dark section.bg-\\[\\#f8fafd\\],
    html.dark section[class*="bg-[#f8fafd]"] {
      background-color: #0d1322 !important;
    }

    html.dark .bg-white:not(body):not(main):not(section):not([data-preserve-white]),
    html.dark [class*="bg-white/"]:not(header):not(nav) {
      background-color: ${darkSurface} !important;
    }

    html.dark [class*="bg-[#f8fafd]"]:not(section),
    html.dark [class*="bg-[#f0f4fc]"]:not(section) {
      background-color: ${darkSurfaceMuted} !important;
    }

    html.dark [class~="text-[#00007B]"] {
      color: ${darkFg} !important;
    }
    html.dark [class*="text-[#00007B]/90"] {
      color: #f1f5f9 !important;
    }
    html.dark [class*="text-[#00007B]/85"] {
      color: #e2e8f0 !important;
    }
    html.dark [class*="text-[#00007B]/80"] {
      color: #cbd5e1 !important;
    }
    html.dark [class*="text-[#00007B]/75"] {
      color: #cbd5e1 !important;
    }
    html.dark [class*="text-[#00007B]/70"] {
      color: #94a3b8 !important;
    }
    html.dark [class*="text-[#00007B]/60"] {
      color: #64748b !important;
    }
    html.dark [class*="text-[#00007B]/40"] {
      color: #475569 !important;
    }

    html.dark [class*="border-[#00007B]/10"],
    html.dark [class*="border-[#00007B]/15"],
    html.dark [class*="border-[#00007B]/20"],
    html.dark [class*="border-[#00007B]/30"],
    html.dark [class~="border-[#00007B]"] {
      border-color: rgba(255, 255, 255, 0.12) !important;
    }

    html.dark [class*="bg-[#00007B]/5"] {
      background-color: ${hexToRgba(primaryColor, 0.18)} !important;
    }
    html.dark [class*="bg-[#00007B]/10"] {
      background-color: ${hexToRgba(primaryColor, 0.25)} !important;
    }
    html.dark [class*="bg-[#00007B]/15"] {
      background-color: ${hexToRgba(primaryColor, 0.32)} !important;
    }
    html.dark [class*="bg-[#00007B]/20"] {
      background-color: ${hexToRgba(primaryColor, 0.40)} !important;
    }
    html.dark [class*="bg-[#00007B]/"] {
      color: #f8fafc !important;
    }
    html.dark [class*="bg-[#00007B]/"] svg:not([class*="text-[#0F9A73]"]) {
      color: #f8fafc !important;
      stroke: currentColor !important;
    }

    html.dark [class*="bg-[#0F9A73]/10"],
    html.dark [class*="bg-[#0F9A73]/15"],
    html.dark [class*="bg-[#0F9A73]/20"] {
      background-color: ${hexToRgba(accentColor, 0.20)} !important;
      color: ${accentColor} !important;
    }
    html.dark [class*="bg-[#0F9A73]/"] {
      color: ${accentColor} !important;
    }
    html.dark [class*="bg-[#0F9A73]/"] svg {
      color: ${accentColor} !important;
    }
    html.dark [class*="bg-[#0F9A73]/"] span:not([class*="bg-"]) {
      color: ${accentColor} !important;
    }

    html.dark header,
    html.dark nav.bg-white\\/95,
    html.dark header.bg-white\\/95 {
      background-color: rgba(10, 14, 26, 0.92) !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    html.dark header.bg-white\\/80,
    html.dark nav.bg-white\\/80 {
      background-color: rgba(10, 14, 26, 0.85) !important;
      border-color: rgba(255, 255, 255, 0.08) !important;
    }
    html.dark nav.hidden {
      background-color: #131c31 !important;
      border-color: rgba(255, 255, 255, 0.12) !important;
    }
    html.dark nav.hidden a:not([class*="bg-[#00007B]"]) {
      color: #cbd5e1 !important;
    }
    html.dark nav.hidden a:not([class*="bg-[#00007B]"]):hover {
      color: #ffffff !important;
      background-color: #1e293b !important;
    }
    html.dark header button {
      border-color: rgba(255, 255, 255, 0.15) !important;
    }
    html.dark header kbd {
      background-color: #131c31 !important;
      border-color: rgba(255, 255, 255, 0.15) !important;
      color: #f8fafc !important;
    }

    html.dark .fixed.inset-x-0.top-\\[65px\\] {
      background-color: #0b0f19 !important;
      border-color: rgba(255, 255, 255, 0.12) !important;
    }
    html.dark .fixed.inset-x-0.top-\\[65px\\] a:not([class*="bg-[#00007B]"]) {
      color: #f8fafc !important;
    }
    html.dark .fixed.inset-x-0.top-\\[65px\\] a:not([class*="bg-[#00007B]"]):hover {
      background-color: #162036 !important;
    }

    html.dark footer {
      background-color: #070a12 !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    html.dark footer a.bg-white {
      background-color: #131c31 !important;
      border-color: rgba(255, 255, 255, 0.15) !important;
      color: #f8fafc !important;
    }
    html.dark footer a.bg-white:hover {
      border-color: ${accentColor} !important;
      color: ${accentColor} !important;
    }

    html.dark input,
    html.dark textarea,
    html.dark select {
      background-color: #131c31 !important;
      color: #f8fafc !important;
      border-color: rgba(255, 255, 255, 0.18) !important;
    }
    html.dark input:focus,
    html.dark textarea:focus,
    html.dark select:focus {
      background-color: #162038 !important;
      border-color: ${accentColor} !important;
    }
    html.dark input::placeholder,
    html.dark textarea::placeholder {
      color: rgba(248, 250, 252, 0.45) !important;
    }

    html.dark aside,
    html.dark .min-h-screen.bg-\\[\\#f8fafd\\] {
      background-color: #0a0e1a !important;
    }
    html.dark aside,
    html.dark aside > div {
      background-color: #0e1424 !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    html.dark aside a:not([class*="bg-[#0F9A73]"]) {
      color: #cbd5e1 !important;
    }
    html.dark aside a:not([class*="bg-[#0F9A73]"]):hover {
      background-color: #162036 !important;
      color: #ffffff !important;
    }
    html.dark header.h-16 {
      background-color: #0e1424 !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    html.dark .bg-\\[\\#f8fafd\\] {
      background-color: #131c31 !important;
    }
  `;
}
