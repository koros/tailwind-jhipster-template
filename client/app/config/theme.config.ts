export interface Theme {
  id: string;
  name: string;
  icon: string;
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
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    icon: '☀️',
    colors: {
      // Base colors
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#1a202c',
      textSecondary: '#718096',
      border: '#e2e8f0',

      // Button states
      buttonPrimary: '#667eea',
      buttonPrimaryHover: '#5568d3',
      buttonSecondary: '#718096',
      buttonSecondaryHover: '#4a5568',

      // Semantic colors
      success: '#48bb78',
      warning: '#ed8936',
      error: '#f56565',
      info: '#4299e1',

      // Additional surfaces
      cardBg: '#ffffff',
      inputBg: '#ffffff',
      inputBorder: '#e2e8f0',
      inputFocus: '#667eea',

      // Hover and focus states
      hoverBg: '#f7fafc',
      focusRing: '#667eea',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#1a202c',
      surface: '#2d3748',
      text: '#f7fafc',
      textSecondary: '#cbd5e0',
      border: '#4a5568',
      buttonPrimary: '#667eea',
      buttonPrimaryHover: '#5568d3',
      buttonSecondary: '#4a5568',
      buttonSecondaryHover: '#2d3748',
      success: '#68d391',
      warning: '#f6ad55',
      error: '#fc8181',
      info: '#63b3ed',
      cardBg: '#2d3748',
      inputBg: '#2d3748',
      inputBorder: '#4a5568',
      inputFocus: '#667eea',
      hoverBg: '#4a5568',
      focusRing: '#667eea',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    colors: {
      primary: '#4facfe',
      secondary: '#00f2fe',
      accent: '#43e97b',
      background: '#0f2027',
      surface: '#203a43',
      text: '#e0f7fa',
      textSecondary: '#80deea',
      border: '#2c5364',
      buttonPrimary: '#4facfe',
      buttonPrimaryHover: '#00f2fe',
      buttonSecondary: '#2c5364',
      buttonSecondaryHover: '#203a43',
      success: '#43e97b',
      warning: '#ffa726',
      error: '#ef5350',
      info: '#4facfe',
      cardBg: '#203a43',
      inputBg: '#203a43',
      inputBorder: '#2c5364',
      inputFocus: '#4facfe',
      hoverBg: '#2c5364',
      focusRing: '#4facfe',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(15, 32, 39, 0.5)',
      md: '0 4px 6px -1px rgba(15, 32, 39, 0.6), 0 2px 4px -1px rgba(15, 32, 39, 0.5)',
      lg: '0 10px 15px -3px rgba(15, 32, 39, 0.7), 0 4px 6px -2px rgba(15, 32, 39, 0.6)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    colors: {
      primary: '#ff6b6b',
      secondary: '#feca57',
      accent: '#ee5a6f',
      background: '#2d1b2e',
      surface: '#4a2c46',
      text: '#fff5e1',
      textSecondary: '#ffcccb',
      border: '#6b4c5e',
      buttonPrimary: '#ff6b6b',
      buttonPrimaryHover: '#ee5a6f',
      buttonSecondary: '#6b4c5e',
      buttonSecondaryHover: '#4a2c46',
      success: '#a8e063',
      warning: '#feca57',
      error: '#ff6b6b',
      info: '#ee5a6f',
      cardBg: '#4a2c46',
      inputBg: '#4a2c46',
      inputBorder: '#6b4c5e',
      inputFocus: '#ff6b6b',
      hoverBg: '#6b4c5e',
      focusRing: '#ff6b6b',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(45, 27, 46, 0.4)',
      md: '0 4px 6px -1px rgba(45, 27, 46, 0.5), 0 2px 4px -1px rgba(45, 27, 46, 0.4)',
      lg: '0 10px 15px -3px rgba(45, 27, 46, 0.6), 0 4px 6px -2px rgba(45, 27, 46, 0.5)',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    colors: {
      primary: '#56ab2f',
      secondary: '#a8e063',
      accent: '#7fb285',
      background: '#1a231a',
      surface: '#2d3e2d',
      text: '#e8f5e9',
      textSecondary: '#a5d6a7',
      border: '#4a5f4a',
      buttonPrimary: '#56ab2f',
      buttonPrimaryHover: '#a8e063',
      buttonSecondary: '#4a5f4a',
      buttonSecondaryHover: '#2d3e2d',
      success: '#a8e063',
      warning: '#feca57',
      error: '#ef5350',
      info: '#7fb285',
      cardBg: '#2d3e2d',
      inputBg: '#2d3e2d',
      inputBorder: '#4a5f4a',
      inputFocus: '#56ab2f',
      hoverBg: '#4a5f4a',
      focusRing: '#56ab2f',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(26, 35, 26, 0.4)',
      md: '0 4px 6px -1px rgba(26, 35, 26, 0.5), 0 2px 4px -1px rgba(26, 35, 26, 0.4)',
      lg: '0 10px 15px -3px rgba(26, 35, 26, 0.6), 0 4px 6px -2px rgba(26, 35, 26, 0.5)',
    },
  },
  {
    id: 'purple',
    name: 'Purple Dream',
    icon: '💜',
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      accent: '#8b5cf6',
      background: '#1e1b2e',
      surface: '#2d2844',
      text: '#f5f3ff',
      textSecondary: '#ddd6fe',
      border: '#4c3d5e',
      buttonPrimary: '#a855f7',
      buttonPrimaryHover: '#8b5cf6',
      buttonSecondary: '#4c3d5e',
      buttonSecondaryHover: '#2d2844',
      success: '#a8e063',
      warning: '#feca57',
      error: '#ec4899',
      info: '#8b5cf6',
      cardBg: '#2d2844',
      inputBg: '#2d2844',
      inputBorder: '#4c3d5e',
      inputFocus: '#a855f7',
      hoverBg: '#4c3d5e',
      focusRing: '#a855f7',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(30, 27, 46, 0.4)',
      md: '0 4px 6px -1px rgba(30, 27, 46, 0.5), 0 2px 4px -1px rgba(30, 27, 46, 0.4)',
      lg: '0 10px 15px -3px rgba(30, 27, 46, 0.6), 0 4px 6px -2px rgba(30, 27, 46, 0.5)',
    },
  },
];

export const defaultTheme = themes[0]; // Light theme as default
