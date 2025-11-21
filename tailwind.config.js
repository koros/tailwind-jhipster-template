/** Tailwind configuration */
module.exports = {
  content: ['./src/main/webapp/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#533f03',
        navbar: '#353d47',
        accent: '#009cd8',
        error: '#ff0000',
        bg: '#fafafa',
      },
      boxShadow: {
        app: '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
