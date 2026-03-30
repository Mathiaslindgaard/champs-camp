import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cc-orange':       'var(--cc-orange)',
        'cc-orange-dark':  'var(--cc-orange-dark)',
        'cc-orange-light': 'var(--cc-orange-light)',
        'cc-black':        'var(--cc-black)',
        'cc-black-mid':    'var(--cc-black-mid)',
        'cc-black-card':   'var(--cc-black-card)',
        'cc-black-border': 'var(--cc-black-border)',
        'cc-gray':         'var(--cc-gray)',
        'cc-gray-light':   'var(--cc-gray-light)',
        'cc-red':          'var(--cc-red)',
        'cc-red-light':    'var(--cc-red-light)',
        'cc-green':        'var(--cc-green)',
        'cc-green-light':  'var(--cc-green-light)',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        dm:    ['var(--font-dm)',    'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
