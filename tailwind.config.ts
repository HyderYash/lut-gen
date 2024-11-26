import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#B89272',
          dark: '#a17b5d',
          light: '#d4b79c',
        },
        dark: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - 3rem))' }
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'line-scroll': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'scroll-left': 'scroll-left 25s linear infinite',
        'scroll-right': 'scroll-right 25s linear infinite',
        'line-scroll': 'line-scroll 3s ease-in-out infinite'
      }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide::-webkit-scrollbar': {
          'display': 'none'
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }
      })
    })
  ],
};
export default config;
