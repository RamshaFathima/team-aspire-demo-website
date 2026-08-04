/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          primary:   '#6B0F1A',
          secondary: '#8C1C2E',
          tertiary:  '#D9A5A5',
          neutral:   '#F7F4F2',
          dark:      '#4A0812',
        },
      },
      backgroundImage: {
        'gradient-hero':   'linear-gradient(135deg, #F7F4F2 0%, #f5ebe6 45%, #eddad5 100%)',
        'gradient-impact': 'linear-gradient(135deg, #6B0F1A 0%, #8C1C2E 60%, #5a0a15 100%)',
      },
      boxShadow: {
        soft: '0 2px 10px 0 rgba(107,15,26,0.08)',
        card: '0 8px 32px 0 rgba(107,15,26,0.14)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

