/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#0a0a0a",
          light: "#121212",
          panel: "#1c1c1c"
        },
        border: {
          DEFAULT: "#2d2d2d",
          highlight: "#3d3d3d"
        },
        text: {
          primary: "#E0E0E0",
          secondary: "#a0a0a0",
          muted: "#707070"
        },
        accent: {
          blue: "#00bcd4",
          green: "#00ff9d",
          amber: "#ffbe76",
          red: "#ff5252"
        },
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
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00bcd4, 0 0 10px rgba(0, 188, 212, 0.5)',
        'neon-green': '0 0 5px #00ff9d, 0 0 10px rgba(0, 255, 157, 0.5)',
        'neon-amber': '0 0 5px #ffbe76, 0 0 10px rgba(255, 190, 118, 0.5)',
        'panel': '0 4px 12px rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'flicker': 'flicker 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.5' },
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
} 