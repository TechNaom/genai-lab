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
        display: ['Bricolage Grotesque', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3.2rem,9vw,6.5rem)', { lineHeight: '1.0', letterSpacing: '-4px', fontWeight: '800' }],
        'h1':   ['clamp(2rem,5vw,3.2rem)',   { lineHeight: '1.1', letterSpacing: '-1.5px', fontWeight: '800' }],
        'h2':   ['clamp(1.6rem,3vw,2rem)',   { lineHeight: '1.15', letterSpacing: '-0.5px', fontWeight: '700' }],
        'h3':   ['1.25rem',                  { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1.1rem',                   { lineHeight: '1.9' }],
        'sm':   ['0.875rem',                 { lineHeight: '1.65' }],
        'label':['0.6875rem',                { letterSpacing: '1.5px' }],
      },
      colors: {
        bg:      { DEFAULT: '#050a0f', 2: '#080f17', 3: '#0a1520' },
        surface: { DEFAULT: '#0d1e2e', 2: '#112436' },
        border:  { DEFAULT: '#1a3048', 2: '#1f3a58' },
        accent:  { DEFAULT: '#00d4ff', 2: '#0088cc' },
        brand: {
          green:  '#00ff9d',
          purple: '#a78bfa',
          orange: '#ff8c42',
          red:    '#ff4d6d',
          gold:   '#ffd700',
        },
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body':      '#8ab4d4',
            '--tw-prose-headings':  '#e8f4ff',
            '--tw-prose-code':      '#00d4ff',
            '--tw-prose-pre-bg':    '#080f17',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
