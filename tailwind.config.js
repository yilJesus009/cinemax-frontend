/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cinema: '#b91c1c',
        night: '#111827',
        gold: '#f59e0b',
        paper: '#f8fafc'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
