/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        bg: {
          primary: '#050a0f',
          secondary: '#080f17',
          tertiary: '#0a1520',
        },
        surface: {
          DEFAULT: '#0d1e2e',
          2: '#112436',
        },
        border: {
          DEFAULT: '#1a3048',
          2: '#1f3a58',
        },
        accent: {
          DEFAULT: '#00d4ff',
          2: '#0088cc',
        },
        brand: {
          green: '#00ff9d',
          purple: '#a78bfa',
          orange: '#ff8c42',
          red: '#ff4d6d',
          gold: '#ffd700',
        },
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#8ab4d4',
            '--tw-prose-headings': '#e8f4ff',
            '--tw-prose-code': '#00d4ff',
            '--tw-prose-pre-bg': '#080f17',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
