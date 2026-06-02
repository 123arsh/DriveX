export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        panel: '#08090D',
        accent: '#7C3AED',
        surface: '#0F172A',
      },
      boxShadow: {
        panel: '0 20px 80px rgba(15, 23, 42, 0.55)',
      },
      fontFamily: {
        brand: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
