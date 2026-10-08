'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  FolderGit2, 
  Cpu, 
  Briefcase, 
  FileText, 
  Mail, 
  Lock, 
  Sun, 
  Moon, 
  Sparkles, 
  ArrowRight,
  X,
  ExternalLink
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Projects' | 'Actions' | 'Social';
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const commands: CommandItem[] = [
    {
      id: 'home',
      title: 'Go to Overview / Home',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-[#0F9A73]" />,
      action: () => router.push('/'),
      shortcut: 'H',
    },
    {
      id: 'projects',
      title: 'Explore Featured Projects & Case Studies',
      category: 'Navigation',
      icon: <FolderGit2 className="w-4 h-4 text-[#0F9A73]" />,
      action: () => router.push('/projects'),
      shortcut: 'P',
    },
    {
      id: 'skills',
      title: 'View Technical Skills & Architecture',
      category: 'Navigation',
      icon: <Cpu className="w-4 h-4 text-[#0F9A73]" />,
      action: () => router.push('/skills'),
      shortcut: 'S',
    },
    {
      id: 'experience',
      title: 'Career & Work Experience Timeline',
      category: 'Navigation',
      icon: <Briefcase className="w-4 h-4 text-[#0F9A73]" />,
      action: () => router.push('/experience'),
      shortcut: 'E',
    },
    {
      id: 'resume',
      title: 'Download or View Resume / CV',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-amber-400" />,
      action: () => router.push('/resume'),
      shortcut: 'R',
    },
    {
      id: 'contact',
      title: 'Initiate Contact / Send Inquiry',
      category: 'Actions',
      icon: <Mail className="w-4 h-4 text-[#0F9A73]" />,
      action: () => router.push('/contact'),
      shortcut: 'C',
    },
    {
      id: 'admin',
      title: 'Access Admin CMS Portal',
      category: 'Actions',
      icon: <Lock className="w-4 h-4 text-rose-400" />,
      action: () => router.push('/admin'),
    },
    {
      id: 'theme',
      title: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      category: 'Actions',
      icon: isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#0F9A73]" />,
      action: () => setTheme(isDark ? 'light' : 'dark'),
      shortcut: 'T',
    },
    {
      id: 'github',
      title: 'Open GitHub Profile (@alexmorgan)',
      category: 'Social',
      icon: <ExternalLink className="w-4 h-4 text-slate-300" />,
      action: () => window.open('https://github.com/alexmorgan', '_blank'),
    },
    {
      id: 'linkedin',
      title: 'Connect on LinkedIn',
      category: 'Social',
      icon: <ExternalLink className="w-4 h-4 text-slate-300" />,
      action: () => window.open('https://linkedin.com/in/alexmorgan-dev', '_blank'),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback((cmd: CommandItem) => {
    setIsOpen(false);
    setSearch('');
    cmd.action();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen || filteredCommands.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleSelect(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, filteredCommands, selectedIndex, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl border border-white/20 bg-[#00007B] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#000033]">
          <Search className="w-5 h-5 text-[#0F9A73] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search (e.g. Projects, Skills, Resume)..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-300 hover:text-white rounded-md hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-300">
              No matching commands or pages found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-all ${
                    isSelected
                      ? 'bg-[#0F9A73]/25 text-white border border-[#0F9A73]'
                      : 'text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                      {cmd.icon}
                    </span>
                    <span className="truncate font-medium">{cmd.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10">
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-300 bg-black/40 rounded border border-white/15">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-[#0F9A73]' : 'text-white/40'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard instructions footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-[#000033] text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/15">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/15">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/15">ESC</kbd> Close</span>
          </div>
          <span className="text-[#0F9A73]">Press ⌘K anytime</span>
        </div>
      </div>
    </div>
  );
};
