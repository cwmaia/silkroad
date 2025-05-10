/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          400: '#9ca3af',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        blue: {
          400: '#60a5fa',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        green: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        purple: {
          600: '#9333ea',
          700: '#7e22ce',
        }
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
      },
      borderRadius: {
        'md': '0.375rem',
      },
      opacity: {
        '50': '0.5',
      },
      cursor: {
        'pointer': 'pointer',
        'not-allowed': 'not-allowed',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
} 