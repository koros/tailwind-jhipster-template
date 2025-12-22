import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, themes, defaultTheme } from '../../../config/theme.config';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Load theme from localStorage on initial render
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    return themes.find(t => t.id === savedThemeId) || defaultTheme;
  });

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  };

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
