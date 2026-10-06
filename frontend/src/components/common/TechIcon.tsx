'use client';

import React from 'react';
import {
  Code,
  Cpu,
  Database,
  Cloud,
  Terminal,
  Server,
  Layers,
  Globe,
  Shield,
  Smartphone,
  Box,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  MessageSquare,
  Mail,
  ExternalLink,
  Award,
  Wrench,
  FileCode,
} from 'lucide-react';

interface TechIconProps {
  name?: string | null;
  className?: string;
  size?: number;
  fallback?: React.ReactNode;
}

export const TECH_LIBRARY = [
  // Frontend
  { id: 'react', name: 'React', category: 'Frontend', color: '#61DAFB' },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', color: '#000000' },
  { id: 'typescript', name: 'TypeScript', category: 'Frontend', color: '#3178C6' },
  { id: 'javascript', name: 'JavaScript', category: 'Frontend', color: '#F7DF1E' },
  { id: 'vue', name: 'Vue.js', category: 'Frontend', color: '#4FC08D' },
  { id: 'angular', name: 'Angular', category: 'Frontend', color: '#DD0031' },
  { id: 'svelte', name: 'Svelte', category: 'Frontend', color: '#FF3E00' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', color: '#06B6D4' },
  { id: 'html5', name: 'HTML5', category: 'Frontend', color: '#E34F26' },
  { id: 'css3', name: 'CSS3', category: 'Frontend', color: '#1572B6' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'Backend', color: '#339933' },
  { id: 'express', name: 'Express.js', category: 'Backend', color: '#000000' },
  { id: 'python', name: 'Python', category: 'Backend', color: '#3776AB' },
  { id: 'django', name: 'Django', category: 'Backend', color: '#092E20' },
  { id: 'fastapi', name: 'FastAPI', category: 'Backend', color: '#05998B' },
  { id: 'golang', name: 'Go / Golang', category: 'Backend', color: '#00ADD8' },
  { id: 'rust', name: 'Rust', category: 'Backend', color: '#DEA584' },
  { id: 'java', name: 'Java', category: 'Backend', color: '#ED8B00' },
  { id: 'graphql', name: 'GraphQL', category: 'Backend', color: '#E10098' },
  { id: 'restapi', name: 'REST API', category: 'Backend', color: '#0F9A73' },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', color: '#4169E1' },
  { id: 'mongodb', name: 'MongoDB', category: 'Database', color: '#47A248' },
  { id: 'mysql', name: 'MySQL', category: 'Database', color: '#4479A1' },
  { id: 'redis', name: 'Redis', category: 'Database', color: '#DC382D' },
  { id: 'sqlite', name: 'SQLite', category: 'Database', color: '#003B57' },
  { id: 'prisma', name: 'Prisma ORM', category: 'Database', color: '#2D3748' },
  { id: 'supabase', name: 'Supabase', category: 'Database', color: '#3ECF8E' },
  { id: 'firebase', name: 'Firebase', category: 'Database', color: '#FFCA28' },

  // Cloud & DevOps
  { id: 'docker', name: 'Docker', category: 'DevOps / Cloud', color: '#2496ED' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps / Cloud', color: '#326CE5' },
  { id: 'aws', name: 'AWS Cloud', category: 'DevOps / Cloud', color: '#FF9900' },
  { id: 'gcp', name: 'Google Cloud (GCP)', category: 'DevOps / Cloud', color: '#4285F4' },
  { id: 'azure', name: 'Microsoft Azure', category: 'DevOps / Cloud', color: '#0078D4' },
  { id: 'git', name: 'Git', category: 'DevOps / Cloud', color: '#F05032' },
  { id: 'linux', name: 'Linux OS', category: 'DevOps / Cloud', color: '#FCC624' },
  { id: 'vercel', name: 'Vercel', category: 'DevOps / Cloud', color: '#000000' },
  { id: 'cicd', name: 'CI/CD Pipelines', category: 'DevOps / Cloud', color: '#0F9A73' },

  // Platforms / Social
  { id: 'github', name: 'GitHub', category: 'Platform / Social', color: '#181717' },
  { id: 'linkedin', name: 'LinkedIn', category: 'Platform / Social', color: '#0A66C2' },
  { id: 'twitter', name: 'Twitter / X', category: 'Platform / Social', color: '#1DA1F2' },
  { id: 'discord', name: 'Discord', category: 'Platform / Social', color: '#5865F2' },
  { id: 'youtube', name: 'YouTube', category: 'Platform / Social', color: '#FF0000' },
  { id: 'medium', name: 'Medium', category: 'Platform / Social', color: '#000000' },
  { id: 'devto', name: 'Dev.to', category: 'Platform / Social', color: '#0A0A0A' },
  { id: 'figma', name: 'Figma', category: 'Design', color: '#F24E1E' },
  { id: 'globe', name: 'Personal Website', category: 'Platform / Social', color: '#00007B' },
  { id: 'email', name: 'Email Contact', category: 'Platform / Social', color: '#0F9A73' },
];

export const TechIcon: React.FC<TechIconProps> = ({
  name,
  className = '',
  size = 20,
  fallback,
}) => {
  if (!name) {
    return <>{fallback || <Code style={{ width: size, height: size }} className={className} />}</>;
  }

  const clean = name.trim().toLowerCase();

  // If it's a URL or uploaded image file
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('/uploads/') ||
    clean.startsWith('data:image/')
  ) {
    // Resolve relative backend /uploads path
    const src = clean.startsWith('/uploads/')
      ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${clean}`
      : clean;

    return (
      <img
        src={src}
        alt={name}
        className={`object-contain inline-block rounded ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          // If image fails, replace with code icon
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  // SVG Tech Icons
  switch (clean) {
    case 'react':
    case 'react.js':
    case 'reactjs':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 115.3 100"
          className={className}
          fill="none"
        >
          <ellipse cx="57.65" cy="50" rx="14.3" ry="50" stroke="#61DAFB" strokeWidth="6" transform="matrix(0.5 -0.866 0.866 0.5 -14.52 79.25)" />
          <ellipse cx="57.65" cy="50" rx="14.3" ry="50" stroke="#61DAFB" strokeWidth="6" transform="matrix(0.5 0.866 -0.866 0.5 72.17 -24.97)" />
          <ellipse cx="57.65" cy="50" rx="14.3" ry="50" stroke="#61DAFB" strokeWidth="6" transform="matrix(1 0 0 1 0 0)" />
          <circle cx="57.65" cy="50" r="10" fill="#61DAFB" />
        </svg>
      );

    case 'nextjs':
    case 'next.js':
    case 'next':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 180 180"
          className={className}
          fill="none"
        >
          <circle cx="90" cy="90" r="90" fill="#00007B" />
          <path
            d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
            fill="white"
          />
          <rect x="115" y="54" width="12" height="72" fill="white" />
        </svg>
      );

    case 'typescript':
    case 'ts':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <rect width="128" height="128" rx="16" fill="#3178C6" />
          <path
            d="M77.2 60.5h16.4V108H77.2V60.5zm-28 0h16.4V108H49.2V60.5zm39.5-17.7h-36V28.5h52.8v14.3h-16.8zM41.5 28.5H19.7v14.3h8.3V108h13.5V42.8h8.2V28.5h-8.2z"
            fill="white"
          />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <rect width="128" height="128" rx="16" fill="#F7DF1E" />
          <path
            d="M40 92c0 10.6-6.6 15-16.3 15-10.7 0-16.6-6-17.6-13.6l10.9-6.3c.7 4 3 7.2 6.7 7.2 3.6 0 5.7-1.8 5.7-8.7V50h10.6v42zm48 1c0 8.7-5.5 14-14.7 14-10.3 0-16.4-6.4-17.4-14.4l10.7-6.2c.8 4.2 3.3 7.5 7.1 7.5 3.3 0 5.4-1.7 5.4-4.2 0-3.3-2.6-4.7-8.6-7.2l-3-1.3C58 77 53 72.8 53 63c0-8 6.2-13.7 15-13.7 8.3 0 14 4.5 15.6 12.3l-10.3 6.1c-.6-3.3-2.6-5.4-5.3-5.4-2.5 0-4.3 1.5-4.3 3.6 0 2.5 2 3.8 6.7 5.8l3 1.3c10.5 4.5 14.3 8.8 14.3 19z"
            fill="#000000"
          />
        </svg>
      );

    case 'nodejs':
    case 'node':
    case 'node.js':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M64 12.8L16.2 40.4v55.2L64 123.2l47.8-27.6V40.4L64 12.8z"
            fill="#339933"
          />
          <path
            d="M64 45.4c-11.4 0-16 6-16 14.5v16.2c0 8.5 4.6 14.5 16 14.5s16-6 16-14.5V59.9c0-8.5-4.6-14.5-16-14.5zm6.5 30.7c0 4.6-1.5 6.7-6.5 6.7s-6.5-2.1-6.5-6.7v-16c0-4.6 1.5-6.7 6.5-6.7s6.5 2.1 6.5 6.7v16z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'python':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M63.6 13.2c-27 0-25.3 11.7-25.3 11.7l.03 12.1h25.7v3.6H25.7S13 39.2 13 66.2c0 27 11.1 26 11.1 26h6.6V82.8s-.4-11.4 11.2-11.4h25.4s10.7-.2 10.7-10.3V23.7s1.6-10.5-14.4-10.5zm-14 7.7a3.8 3.8 0 110 7.6 3.8 3.8 0 010-7.6z"
            fill="#3776AB"
          />
          <path
            d="M64.4 114.8c27 0 25.3-11.7 25.3-11.7l-.03-12.1H64v-3.6h38.3s12.7 1.4 12.7-25.6c0-27-11.1-26-11.1-26h-6.6v9.4s.4 11.4-11.2 11.4H61.7s-10.7.2-10.7 10.3v37.4s-1.6 10.5 14.4 10.5zm14-7.7a3.8 3.8 0 110-7.6 3.8 3.8 0 010 7.6z"
            fill="#FFD43B"
          />
        </svg>
      );

    case 'docker':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M123.6 57.5c-2.3-1.6-7.3-2.6-11.6-1.5-.7-5.5-4.2-10-4.2-10-4.2 3.6-6.4 9.4-6.4 9.4-3.2-1.9-7.2-3.1-11.4-3.1-1.3 0-2.5.1-3.7.4-4-9-12.7-10.2-12.7-10.2-2.1 4.7-1.3 9.7-.5 12.6-1.6.8-3.1 1.7-4.4 2.8H7v36.8c0 19.3 15.6 35 34.9 35 27.6 0 49.3-14.2 59.9-36.9 14.7-.7 23.4-11 23.4-11-.4-8.8-1.6-14.3-1.6-14.3zm-77.9-2.9h9.8v9.8h-9.8v-9.8zm0-12.7h9.8v9.8h-9.8v-9.8zm12.7 12.7h9.8v9.8h-9.8v-9.8zm0-12.7h9.8v9.8h-9.8v-9.8zm12.7 12.7h9.8v9.8h-9.8v-9.8zm0-12.7h9.8v9.8h-9.8v-9.8zm-38.1 12.7h9.8v9.8h-9.8v-9.8zm0-12.7h9.8v9.8h-9.8v-9.8zm-12.7 12.7h9.8v9.8h-9.8v-9.8z"
            fill="#2496ED"
          />
        </svg>
      );

    case 'kubernetes':
    case 'k8s':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M64 12l45 26v52L64 116 19 90V38l45-26z"
            fill="#326CE5"
          />
          <circle cx="64" cy="64" r="22" fill="#FFFFFF" />
          <path
            d="M64 48v32M48 64h32M52 52l24 24M76 52L52 76"
            stroke="#326CE5"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'postgresql':
    case 'postgres':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <circle cx="64" cy="64" r="56" fill="#336791" />
          <path
            d="M89 77c-2-7-8-12-14-14 4-4 7-10 7-17 0-14-10-23-24-23H42v64h15V66h6c5 0 9 3 9 9 0 6-3 12-8 12h-4v14h7c10 0 18-9 22-24z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'mongodb':
    case 'mongo':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M64 12c-4 16-28 36-28 62 0 24 16 38 27 42 1-5 1-40 1-40s0 35 1 40c11-4 27-18 27-42 0-26-24-46-28-62z"
            fill="#47A248"
          />
        </svg>
      );

    case 'redis':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M12 40l52-24 52 24-52 24-52-24z"
            fill="#DC382D"
          />
          <path
            d="M12 64l52 24 52-24v16l-52 24-52-24V64z"
            fill="#A3241C"
          />
          <path
            d="M12 44l52 24 52-24v16l-52 24-52-24V44z"
            fill="#C62828"
          />
        </svg>
      );

    case 'aws':
    case 'amazon':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <rect width="128" height="128" rx="16" fill="#232F3E" />
          <path
            d="M32 50l10 28h8l10-28h-8l-6 18-6-18h-8zm34 0v28h8V66h12v-7H74v-9h8zm-42 42c26 14 54 14 78 0 2-1 4 1 2 3-27 16-56 16-82 0-2-2 0-4 2-3z"
            fill="#FF9900"
          />
        </svg>
      );

    case 'gcp':
    case 'google cloud':
    case 'google':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <circle cx="64" cy="64" r="56" fill="#F8FAFD" stroke="#00007B" strokeWidth="2" />
          <path d="M72 40h-8c-12 0-22 10-22 22 0 10 7 18 16 21v-12c-4-2-7-6-7-10 0-7 6-12 13-12h8V40z" fill="#4285F4" />
          <path d="M86 52c-3-7-9-12-16-12v9c5 0 9 3 11 8l5-5z" fill="#EA4335" />
          <path d="M70 79c7 0 13-5 16-12l-5-5c-2 5-6 8-11 8v9z" fill="#34A853" />
          <path d="M84 64h-14v-9h14v9z" fill="#FBBC05" />
        </svg>
      );

    case 'azure':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M32 96l24-64h20l-24 64H32zm28-40l16-24h24l-24 64H60l16-24-16-16z"
            fill="#0078D4"
          />
        </svg>
      );

    case 'tailwind':
    case 'tailwindcss':
    case 'tailwind css':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M32 54c4-16 16-24 36-24 24 0 32 16 38 24 4 6 9 10 16 10 6 0 12-4 16-10-4 16-16 24-36 24-24 0-32-16-38-24-4-6-9-10-16-10-6 0-12 4-16 10zm-24 32c4-16 16-24 36-24 24 0 32 16 38 24 4 6 9 10 16 10 6 0 12-4 16-10-4 16-16 24-36 24-24 0-32-16-38-24-4-6-9-10-16-10-6 0-12 4-16 10z"
            fill="#06B6D4"
          />
        </svg>
      );

    case 'git':
      return (
        <svg
          style={{ width: size, height: size }}
          viewBox="0 0 128 128"
          className={className}
        >
          <path
            d="M123.5 56.6L71.4 4.5c-4-4-10.4-4-14.4 0L4.5 56.9c-4 4-4 10.4 0 14.4l52.1 52.1c4 4 10.4 4 14.4 0l52.5-52.5c4-4 4-10.4 0-14.3z"
            fill="#F05032"
          />
          <circle cx="64" cy="64" r="10" fill="#FFFFFF" />
          <circle cx="48" cy="80" r="10" fill="#FFFFFF" />
          <circle cx="80" cy="48" r="10" fill="#FFFFFF" />
          <path d="M48 80l32-32" stroke="#FFFFFF" strokeWidth="6" />
        </svg>
      );

    case 'github':
      return <Github style={{ width: size, height: size }} className={`text-[#181717] ${className}`} />;

    case 'linkedin':
      return <Linkedin style={{ width: size, height: size }} className={`text-[#0A66C2] ${className}`} />;

    case 'twitter':
    case 'x':
      return <Twitter style={{ width: size, height: size }} className={`text-[#1DA1F2] ${className}`} />;

    case 'discord':
      return <MessageSquare style={{ width: size, height: size }} className={`text-[#5865F2] ${className}`} />;

    case 'youtube':
      return <Youtube style={{ width: size, height: size }} className={`text-[#FF0000] ${className}`} />;

    case 'globe':
    case 'website':
      return <Globe style={{ width: size, height: size }} className={`text-[#00007B] ${className}`} />;

    case 'mail':
    case 'email':
      return <Mail style={{ width: size, height: size }} className={`text-[#0F9A73] ${className}`} />;

    case 'database':
      return <Database style={{ width: size, height: size }} className={`text-[#0F9A73] ${className}`} />;

    case 'cloud':
      return <Cloud style={{ width: size, height: size }} className={`text-[#0F9A73] ${className}`} />;

    case 'award':
    case 'cert':
      return <Award style={{ width: size, height: size }} className={`text-[#0F9A73] ${className}`} />;

    default:
      // Generic Stylized Badge with initials or code icon
      return (
        fallback || (
          <span
            style={{ width: size, height: size, fontSize: Math.max(10, size * 0.45) }}
            className={`inline-flex items-center justify-center font-bold font-mono rounded bg-[#00007B]/10 text-[#00007B] border border-[#00007B]/20 uppercase ${className}`}
          >
            {name.slice(0, 2)}
          </span>
        )
      );
  }
};
