import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#e0f2fe',
          100: '#bfdbfe',
        },
        gray: {
          600: '#6b7280',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 2px 8px -2px rgb(0 0 0 / 0.08)',
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
} satisfies Config


