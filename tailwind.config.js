/** Tailwind configuration */
module.exports = {
  content: ['./client/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        primary: 'var(--color-primary, #667eea)',
        secondary: 'var(--color-secondary, #764ba2)',
        accent: 'var(--color-accent, #f093fb)',

        // Semantic colors
        success: 'var(--color-success, #48bb78)',
        warning: 'var(--color-warning, #ed8936)',
        error: 'var(--color-error, #f56565)',
        info: 'var(--color-info, #4299e1)',

        // Legacy brand colors for backwards compatibility
        brand: '#533f03',
        navbar: '#353d47',
        bg: '#fafafa',
      },
      backgroundColor: {
        primary: 'var(--color-background, #ffffff)',
        surface: 'var(--color-surface, #f8f9fa)',
        card: 'var(--color-cardBg, #ffffff)',
        input: 'var(--color-inputBg, #ffffff)',
        hover: 'var(--color-hoverBg, #f7fafc)',

        // Button backgrounds
        'btn-primary': 'var(--color-buttonPrimary, #667eea)',
        'btn-secondary': 'var(--color-buttonSecondary, #718096)',
      },
      textColor: {
        primary: 'var(--color-text, #1a202c)',
        secondary: 'var(--color-textSecondary, #718096)',
      },
      borderColor: {
        primary: 'var(--color-border, #e2e8f0)',
        input: 'var(--color-inputBorder, #e2e8f0)',
        focus: 'var(--color-inputFocus, #667eea)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
        md: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
        lg: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
        app: '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
      },
      ringColor: {
        focus: 'var(--color-focusRing, #667eea)',
      },
    },
  },
  plugins: [],
};
