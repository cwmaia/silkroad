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
    },
  },
  darkMode: 'class',
  plugins: [],
} 