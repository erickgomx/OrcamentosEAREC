/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        price: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#DC2626',
          glow: 'rgba(220, 38, 38, 0.5)',
        },
        'brand-DEFAULT': '#DC2626',
        neutral: {
          950: '#0a0a0a',
        },
        void: '#030303',
        obsidian: '#050505',
        charcoal: '#0E0D0C',
        rec: {
          DEFAULT: '#FF0829',
          bright: '#FF1E1E',
          cinema: '#E50914',
        },
        ash: {
          light: '#F5F3F1',
          DEFAULT: '#B3ADA3',
          dark: '#8A847A',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rec-pulse': 'recPulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        recPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.88)' },
        },
      },
    },
  },
  plugins: [],
};
