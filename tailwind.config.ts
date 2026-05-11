import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefdfb',
          100: '#f8f7f4',
          200: '#f1efe8',
          300: '#e0dfd7',
          400: '#c8c7bf',
          500: '#9c9a92',
          600: '#73726c',
          700: '#5f5e5a',
          800: '#3d3d3a',
          900: '#1a1a18',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
