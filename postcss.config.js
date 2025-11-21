module.exports = {
  plugins: [
    require('tailwindcss'),
    // Keep RTL transformations for existing Bootstrap logical utilities during migration
    require('postcss-rtlcss')(),
    require('autoprefixer'),
  ],
};
