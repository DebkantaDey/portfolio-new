'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ToastProvider } from '@/components/ui/Toast';
import { CommandPalette } from '@/components/common/CommandPalette';
import { SettingsProvider } from '@/context/SettingsContext';

export interface ProvidersProps {
  children: React.ReactNode;
  initialSettings?: Record<string, string>;
}

export function Providers({ children, initialSettings }: ProvidersProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SettingsProvider initialSettings={initialSettings}>
        <ToastProvider>
          {children}
          <CommandPalette />
          <Toaster position="bottom-right" richColors />
        </ToastProvider>
      </SettingsProvider>
    </NextThemesProvider>
  );
}
