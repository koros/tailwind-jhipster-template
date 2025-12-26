export interface Theme {
  id: string;
  name: string;
  icon: string;
  /**
   * Core design tokens for the theme.
   * These map 1:1 to CSS custom properties: --color-*, --shadow-*.
   * Adding a new theme should be as simple as providing this object.
   */
  tokens: {
    colors: {
      // Base colors
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;

      // Button states
      buttonPrimary: string;
      buttonPrimaryHover: string;
      buttonSecondary: string;
      buttonSecondaryHover: string;

      // Semantic colors
      success: string;
      warning: string;
      error: string;
      info: string;

      // Additional surfaces
      cardBg: string;
      inputBg: string;
      inputBorder: string;
      inputFocus: string;

      // Hover and focus states
      hoverBg: string;
      focusRing: string;

      // Hero and navbar
      heroGradient: string;
      navbarScrollBg: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
  };
}

export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    icon: '☀️',
    tokens: {
      colors: {
        // Base colors – high contrast on white
        primary: '#2563eb', // blue-600
        secondary: '#7c3aed', // violet-600
        accent: '#f97316', // orange-500
        background: '#f9fafb',
        surface: '#f3f4f6', // gray-50
        text: '#0f172a', // slate-900
        textSecondary: '#4b5563', // gray-600
        border: '#e5e7eb', // gray-200

        // Button states
        buttonPrimary: '#2563eb',
        buttonPrimaryHover: '#1d4ed8',
        buttonSecondary: '#4b5563',
        buttonSecondaryHover: '#374151',

        // Semantic colors
        success: '#16a34a',
        warning: '#f59e0b',
        error: '#dc2626',
        info: '#2563eb',

        // Additional surfaces
        cardBg: '#ffffff',
        inputBg: '#ffffff',
        inputBorder: '#e5e7eb',
        inputFocus: '#2563eb',

        // Hover and focus states
        hoverBg: '#e5e7eb',
        focusRing: 'rgba(37, 99, 235, 0.35)',

        // Hero and navbar
        heroGradient: 'linear-gradient(135deg, #1e3a8a, #7c3aed, #9333ea)',
        navbarScrollBg: '#7c3aed',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(15, 23, 42, 0.08)',
        md: '0 4px 8px rgba(15, 23, 42, 0.08)',
        lg: '0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
    tokens: {
      colors: {
        primary: '#60a5fa', // blue-400
        secondary: '#a855f7', // purple-500
        accent: '#f97316', // orange-500
        background: '#020617', // slate-950
        surface: '#172036', // slate-900
        text: '#e5e7eb', // gray-200
        textSecondary: '#9ca3af', // gray-400
        border: '#1f2937', // gray-800
        buttonPrimary: '#3b82f6',
        buttonPrimaryHover: '#1d4ed8',
        buttonSecondary: '#374151',
        buttonSecondaryHover: '#111827',
        success: '#22c55e',
        warning: '#facc15',
        error: '#f97373',
        info: '#38bdf8',
        cardBg: '#020617',
        inputBg: '#374151',
        inputBorder: '#1f2937',
        inputFocus: '#3b82f6',
        hoverBg: '#020617',
        focusRing: 'rgba(59, 130, 246, 0.45)',

        // Hero and navbar
        // linear-gradient(135deg, #043482, #0f172a, #654d59)
        heroGradient: 'linear-gradient(135deg, #043482, #0f172a, #654d59)',
        navbarScrollBg: '#0f172a',
      },
      shadows: {
        sm: '0 1px 2px 0 #6e86b4',
        md: '0 4px 8px #6e86b4',
        lg: '0 20px 30px -15px #6e86b4',
      },
    },
  },
];

export const defaultTheme = themes[0]; // Light theme as default
