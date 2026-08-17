/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"League Spartan"', '"Spartan"', 'sans-serif'],
      },
      colors: {
        brand: {
          primary:   '#6D0B2F',
          secondary: '#C7A05C',
          tertiary:  '#E8D5B7',
          neutral:   '#FBF9F7',
          dark:      '#4A0820',
          muted:     '#F5F0EA',
        },
      },
      backgroundImage: {
        'gradient-hero':   'linear-gradient(135deg, #FBF9F7 0%, #F8F2EA 50%, #F0E8D8 100%)',
        'gradient-impact': 'linear-gradient(135deg, #6D0B2F 0%, #8C1030 60%, #4A0820 100%)',
        'gradient-gold':   'linear-gradient(135deg, #C7A05C 0%, #D4AF6B 100%)',
      },
      boxShadow: {
        soft: '0 2px 10px 0 rgba(109,11,47,0.08)',
        card: '0 8px 32px 0 rgba(109,11,47,0.12)',
        gold: '0 4px 20px 0 rgba(199,160,92,0.25)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out infinite',
        fadeIn:  'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

