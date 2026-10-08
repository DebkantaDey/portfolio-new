'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';
import { WebsiteSetting } from '../types';
import {
  DEFAULT_SETTINGS,
  FONT_MAP,
  generateThemeCSS,
  getContrastColor,
  getGoogleFontUrl,
  hexToRgba,
  isDarkColor,
} from '../lib/themeHelper';

export {
  DEFAULT_SETTINGS,
  FONT_MAP,
  generateThemeCSS,
  getContrastColor,
  getGoogleFontUrl,
  hexToRgba,
  isDarkColor,
};

export interface SettingsContextType {
  settings: WebsiteSetting[];
  settingsMap: Record<string, string>;
  getSetting: (key: string, fallback?: string) => string;
  updateSettingValue: (key: string, value: string) => void;
  updateSettingsBatch: (updates: Record<string, string>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  setPreviewStyle: (key: string, value: string) => void;
  clearPreview: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export interface SettingsProviderProps {
  children: React.ReactNode;
  initialSettings?: Record<string, string>;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  initialSettings,
}) => {
  const [settings, setSettings] = useState<WebsiteSetting[]>([]);

  // Initialize immediately with server initialSettings, client window cache, or localStorage
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      return { ...DEFAULT_SETTINGS, ...initialSettings };
    }
    if (typeof window !== 'undefined') {
      try {
        if ((window as any).__INITIAL_SETTINGS__) {
          return { ...DEFAULT_SETTINGS, ...(window as any).__INITIAL_SETTINGS__ };
        }
        const cached = localStorage.getItem('portfolio_website_settings');
        if (cached) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(cached) };
        }
      } catch {}
    }
    return DEFAULT_SETTINGS;
  });

  const [previewOverrides, setPreviewOverrides] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Apply theme styles dynamically into DOM
  const applyThemeToDOM = useCallback((currentMap: Record<string, string>) => {
    if (typeof window === 'undefined') return;

    const fullMap = { ...DEFAULT_SETTINGS, ...currentMap };
    const primaryColor = fullMap.primaryColor || DEFAULT_SETTINGS.primaryColor;
    const accentColor = fullMap.accentColor || DEFAULT_SETTINGS.accentColor;
    const backgroundColor = fullMap.backgroundColor || DEFAULT_SETTINGS.backgroundColor;
    const textColor = fullMap.textColor || DEFAULT_SETTINGS.textColor;
    const surfaceColor = fullMap.surfaceColor || DEFAULT_SETTINGS.surfaceColor;
    const fontName = fullMap.fontFamily || DEFAULT_SETTINGS.fontFamily;

    const primaryContrast = getContrastColor(primaryColor);
    const accentContrast = getContrastColor(accentColor);

    // 1. Set CSS custom properties on document root
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-navy', primaryColor);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--accent-cyan', accentColor);
    root.style.setProperty('--primary-contrast', primaryContrast);
    root.style.setProperty('--accent-contrast', accentContrast);
    root.style.removeProperty('--background');
    root.style.removeProperty('--background-color');
    root.style.removeProperty('--foreground');
    root.style.removeProperty('--text-color');
    root.style.removeProperty('--surface-color');
    root.style.removeProperty('--site-surface');
    root.style.removeProperty('--border-subtle');

    // 2. Load Google Font dynamically if not System
    const fontUrl = getGoogleFontUrl(fontName);
    if (fontUrl) {
      const linkId = 'dynamic-google-font-link';
      let linkEl = document.getElementById(linkId) as HTMLLinkElement;
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.id = linkId;
        linkEl.rel = 'stylesheet';
        document.head.appendChild(linkEl);
      }
      if (linkEl.href !== fontUrl) {
        linkEl.href = fontUrl;
      }
    }

    // 3. Inject dynamic stylesheet override
    const styleId = 'dynamic-portfolio-theme-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = generateThemeCSS(fullMap);

    // 4. Update document title if siteName is present
    if (fullMap.siteName && typeof document !== 'undefined') {
      if (!window.location.pathname.startsWith('/admin')) {
        document.title = fullMap.siteName;
      }
    }
  }, []);

  // Fetch settings from API and update local storage & DOM
  const refreshSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      if (Array.isArray(data)) {
        setSettings(data);
        const map: Record<string, string> = { ...DEFAULT_SETTINGS };
        data.forEach((s) => {
          if (s.key && s.value !== undefined) {
            map[s.key] = s.value;
          }
        });
        setSettingsMap(map);
        try {
          localStorage.setItem('portfolio_website_settings', JSON.stringify(map));
          (window as any).__INITIAL_SETTINGS__ = map;
        } catch {}
        applyThemeToDOM(map);
      }
    } catch (err) {
      console.warn('Could not fetch settings from API, using cached or defaults:', err);
      try {
        const cached = localStorage.getItem('portfolio_website_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          const map = { ...DEFAULT_SETTINGS, ...parsed };
          setSettingsMap(map);
          applyThemeToDOM(map);
        } else {
          applyThemeToDOM(DEFAULT_SETTINGS);
        }
      } catch {
        applyThemeToDOM(DEFAULT_SETTINGS);
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyThemeToDOM]);

  // Initial load
  useEffect(() => {
    // If initialSettings were supplied from SSR, apply them immediately
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      const merged = { ...DEFAULT_SETTINGS, ...initialSettings };
      applyThemeToDOM(merged);
    } else {
      // Immediate apply from localStorage cache if available to prevent flash
      try {
        const cached = localStorage.getItem('portfolio_website_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          const map = { ...DEFAULT_SETTINGS, ...parsed };
          setSettingsMap(map);
          applyThemeToDOM(map);
        } else {
          applyThemeToDOM(DEFAULT_SETTINGS);
        }
      } catch {}
    }

    refreshSettings();
  }, [refreshSettings, applyThemeToDOM, initialSettings]);

  // Handle active preview overrides
  const effectiveMap = { ...settingsMap, ...previewOverrides };

  // Set real-time style preview
  const setPreviewStyle = useCallback(
    (key: string, value: string) => {
      setPreviewOverrides((prev) => {
        const updated = { ...prev, [key]: value };
        applyThemeToDOM({ ...settingsMap, ...updated });
        return updated;
      });
      setIsDirty(true);
    },
    [settingsMap, applyThemeToDOM]
  );

  const clearPreview = useCallback(() => {
    setPreviewOverrides({});
    setIsDirty(false);
    applyThemeToDOM(settingsMap);
  }, [settingsMap, applyThemeToDOM]);

  const updateSettingValue = useCallback(
    (key: string, value: string) => {
      setPreviewStyle(key, value);
    },
    [setPreviewStyle]
  );

  // Batch update all changed settings to server
  const updateSettingsBatch = useCallback(
    async (updates: Record<string, string>) => {
      setIsSaving(true);
      try {
        const entries = Object.entries(updates);
        await Promise.all(
          entries.map(([key, value]) =>
            api.updateSetting(key, value, `Dynamic setting for ${key}`)
          )
        );

        const newMap = { ...settingsMap, ...updates };
        setSettingsMap(newMap);
        setPreviewOverrides({});
        setIsDirty(false);
        try {
          localStorage.setItem('portfolio_website_settings', JSON.stringify(newMap));
          (window as any).__INITIAL_SETTINGS__ = newMap;
        } catch {}
        applyThemeToDOM(newMap);
        await refreshSettings();
      } finally {
        setIsSaving(false);
      }
    },
    [settingsMap, applyThemeToDOM, refreshSettings]
  );

  // Reset all to defaults
  const resetToDefaults = useCallback(async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        Object.entries(DEFAULT_SETTINGS).map(([key, value]) =>
          api.updateSetting(key, value, `Default setting for ${key}`)
        )
      );
      setSettingsMap(DEFAULT_SETTINGS);
      setPreviewOverrides({});
      setIsDirty(false);
      try {
        localStorage.setItem('portfolio_website_settings', JSON.stringify(DEFAULT_SETTINGS));
        (window as any).__INITIAL_SETTINGS__ = DEFAULT_SETTINGS;
      } catch {}
      applyThemeToDOM(DEFAULT_SETTINGS);
      await refreshSettings();
    } finally {
      setIsSaving(false);
    }
  }, [applyThemeToDOM, refreshSettings]);

  const getSetting = useCallback(
    (key: string, fallback?: string): string => {
      if (effectiveMap[key] !== undefined && effectiveMap[key] !== '') {
        return effectiveMap[key];
      }
      if (fallback !== undefined) {
        return fallback;
      }
      return DEFAULT_SETTINGS[key] || '';
    },
    [effectiveMap]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        settingsMap: effectiveMap,
        getSetting,
        updateSettingValue,
        updateSettingsBatch,
        resetToDefaults,
        refreshSettings,
        isLoading,
        isSaving,
        isDirty,
        setPreviewStyle,
        clearPreview,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
