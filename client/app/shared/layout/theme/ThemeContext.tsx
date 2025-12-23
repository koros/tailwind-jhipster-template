import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, themes, defaultTheme } from '../../../config/theme.config';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';

const getThemeById = (themeId?: string | null): Theme | undefined => themes.find(t => t.id === themeId);

const getStoredThemePreference = (): Theme | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return getThemeById(localStorage.getItem(THEME_STORAGE_KEY));
};

const getSystemPreferredTheme = (): Theme | undefined => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return undefined;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return getThemeById(prefersDark ? 'dark' : 'light');
};

const resolveInitialTheme = (): Theme => getStoredThemePreference() || getSystemPreferredTheme() || defaultTheme;

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => resolveInitialTheme());
  const [userSelectedTheme, setUserSelectedTheme] = useState<boolean>(() => !!getStoredThemePreference());

  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setCurrentTheme(theme);
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, themeId);
      }
      setUserSelectedTheme(true);
    }
  };

  useEffect(() => {
    if (userSelectedTheme) {
      return undefined;
    }

    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      const theme = getThemeById(event.matches ? 'dark' : 'light');
      if (theme) {
        setCurrentTheme(theme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handlePreferenceChange);
    } else {
      mediaQuery.addListener(handlePreferenceChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handlePreferenceChange);
      } else {
        mediaQuery.removeListener(handlePreferenceChange);
      }
    };
  }, [userSelectedTheme]);

  useEffect(() => {
    // Apply theme by setting CSS custom properties on the document root.
    // This is the single place that knows how to translate Theme.tokens
    // into concrete CSS variables, so adding a new theme is just data.
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme.id);

    // Set color CSS variables
    Object.entries(currentTheme.tokens.colors).forEach(([key, value]) => {
      // Handle special hero and navbar properties separately
      if (key === 'heroGradient') {
        root.style.setProperty('--hero-gradient', value);
      } else if (key === 'navbarScrollBg') {
        root.style.setProperty('--navbar-scroll-bg', value);
      } else {
        root.style.setProperty(`--color-${key}`, value);
      }
    });

    // Set shadow CSS variables
    Object.entries(currentTheme.tokens.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  }, [currentTheme]);

  return <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: themes }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
