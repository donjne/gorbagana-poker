/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Gorbagana theme colors inspired by Oscar the Grouch
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd38d',
          400: '#5bb85b',
          500: '#3a9f3a',  // Main green
          600: '#2d7f2d',
          700: '#256525',
          800: '#1f511f',
          900: '#1a431a',
          950: '#0d240d',
        },
        // $GOR token colors (gold/orange accent)
        gor: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',  // Main $GOR color
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Gaming UI colors
        background: {
          primary: '#0a0a0a',    // Deep black
          secondary: '#1a1a1a',  // Charcoal
          tertiary: '#2a2a2a',   // Light charcoal
        },
        surface: {
          primary: '#1f2937',    // Dark gray
          secondary: '#374151',  // Medium gray
          tertiary: '#4b5563',   // Light gray
        },
        // Game state colors
        success: '#10b981',      // Bright green for wins
        warning: '#f59e0b',      // Orange for warnings
        danger: '#ef4444',       // Red for losses/folds
        info: '#3b82f6',         // Blue for info
        // Card colors
        card: {
          red: '#dc2626',
          black: '#1f2937',
          back: '#059669',       // Green card back
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        gaming: ['Orbitron', 'monospace'], // For gaming elements
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
      },
    gradientColorStops: {
        'gor-gradient': {
          '0%': '#fbbf24',
          '100%': '#f59e0b',
        }
      }
    },
  },
    plugins: [
    // Add plugin for better form styling
    require('@tailwindcss/forms'),
  ],
}