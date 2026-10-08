'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="w-9 h-9 rounded-lg border border-[#00007B]/15 bg-[#f0f4fc]/60 dark:bg-[#162036]/60 dark:border-white/10" 
        aria-hidden="true" 
      />
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#00007B]/15 dark:border-white/20 bg-[#f0f4fc] dark:bg-[#162036] text-[#00007B] dark:text-amber-300 hover:text-[#0F9A73] dark:hover:text-amber-200 hover:border-[#0F9A73]/50 dark:hover:border-amber-400/50 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F9A73]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-200 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
