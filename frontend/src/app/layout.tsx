import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  DEFAULT_SETTINGS,
  generateThemeCSS,
  getGoogleFontUrl,
} from '../lib/themeHelper';

async function fetchServerSettings(): Promise<Record<string, string>> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const map: Record<string, string> = {};
        json.data.forEach((s: any) => {
          if (s.key && s.value !== undefined) {
            map[s.key] = s.value;
          }
        });
        return map;
      }
    }
  } catch (err) {
    console.warn('Could not fetch settings in RootLayout, using defaults');
  }
  return {};
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchServerSettings();
  const full = { ...DEFAULT_SETTINGS, ...settings };

  return {
    title: full.siteName || 'Debkanta Dey | Senior Full-Stack Engineer & Cloud Architect',
    description:
      full.seoMetaDescription ||
      'Production portfolio of Debkanta Dey. Specializing in Next.js 15, TypeScript, Node.js, PostgreSQL, Docker, and distributed systems architecture.',
    keywords: full.seoKeywords
      ? full.seoKeywords.split(',').map((k) => k.trim())
      : [
          'Debkanta Dey',
          'Full-Stack Developer',
          'Software Architect',
          'Next.js',
          'TypeScript',
          'Node.js',
          'PostgreSQL',
          'Cloud Architecture',
        ],
    authors: [{ name: full.brandName || 'Debkanta Dey', url: 'https://alexmorgan.dev' }],
    openGraph: {
      title: full.siteName || 'Debkanta Dey | Senior Full-Stack Engineer & Cloud Architect',
      description:
        full.seoMetaDescription ||
        'Explore production systems, case studies, technical competencies, and career opportunities.',
      type: 'website',
      url: 'https://alexmorgan.dev',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await fetchServerSettings();
  const fullSettings = { ...DEFAULT_SETTINGS, ...settings };
  const themeCss = generateThemeCSS(fullSettings);
  const fontUrl = getGoogleFontUrl(fullSettings.fontFamily);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {fontUrl && (
          <link
            id="dynamic-google-font-link"
            rel="stylesheet"
            href={fontUrl}
          />
        )}
        <style
          id="dynamic-portfolio-theme-style"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
        <script
          id="portfolio-theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var s = ${JSON.stringify(fullSettings)};
                  window.__INITIAL_SETTINGS__ = s;
                  localStorage.setItem('portfolio_website_settings', JSON.stringify(s));
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#00007B] antialiased selection:bg-[#0F9A73] selection:text-white">
        <Providers initialSettings={fullSettings}>
          <Navbar />
          <main className="flex-1 bg-white">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
