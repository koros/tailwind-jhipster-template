/** Tailwind configuration */
module.exports = {
  content: ['./client/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        primary: 'var(--color-primary, #2563eb)',
        secondary: 'var(--color-secondary, #7c3aed)',
        accent: 'var(--color-accent, #f97316)',

        // Semantic colors
        success: 'var(--color-success, #16a34a)',
        warning: 'var(--color-warning, #f59e0b)',
        error: 'var(--color-error, #dc2626)',
        info: 'var(--color-info, #2563eb)',

        // Legacy brand colors for backwards compatibility
        brand: '#533f03',
        navbar: '#353d47',
        bg: '#fafafa',
      },
      backgroundColor: {
        primary: 'var(--color-background, #ffffff)',
        surface: 'var(--color-surface, #f3f4f6)',
        card: 'var(--color-cardBg, #ffffff)',
        input: 'var(--color-inputBg, #ffffff)',
        hover: 'var(--color-hoverBg, #e5e7eb)',

        // Button backgrounds
        'btn-primary': 'var(--color-buttonPrimary, #2563eb)',
        'btn-secondary': 'var(--color-buttonSecondary, #4b5563)',
      },
      textColor: {
        primary: 'var(--color-text, #0f172a)',
        secondary: 'var(--color-textSecondary, #4b5563)',
      },
      borderColor: {
        primary: 'var(--color-border, #e5e7eb)',
        input: 'var(--color-inputBorder, #e5e7eb)',
        focus: 'var(--color-inputFocus, #2563eb)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm, 0 1px 2px 0 rgba(15, 23, 42, 0.08))',
        md: 'var(--shadow-md, 0 4px 8px rgba(15, 23, 42, 0.08))',
        lg: 'var(--shadow-lg, 0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.10))',
        app: '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
      },
      ringColor: {
        focus: 'var(--color-focusRing, rgba(37, 99, 235, 0.35))',
      },
    },
  },
  plugins: [],
};
