import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f3',
          100: '#fce4e6',
          200: '#f9c9cd',
          300: '#f3a0a8',
          400: '#ec6f7c',
          500: '#e23744',
          600: '#cc2936',
          700: '#ab1f2b',
          800: '#8c1c26',
          900: '#761c24',
        },
        status: {
          gray: '#9ca3af',
          red: '#ef4444',
          blue: '#3b82f6',
          amber: '#f59e0b',
          indigo: '#6366f1',
          green: '#22c55e',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
