export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#080808',
        panel: '#111111',
        glow: '#9f7aea',
        text: '#f5f5f5',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(0,0,0,0.35)',
      },
      fontFamily: {
        brand: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
