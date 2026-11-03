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
        forest: {
          charcoal: '#14251F',
          dark: '#0E1A15',
        },
        graphite: {
          deep: '#252C28',
          mid: '#2F3833',
          border: '#3D4741',
        },
        ivory: {
          warm: '#EAE8DF',
          light: '#F4F3EE',
          dark: '#D8D6CC',
          border: '#CBC8BD',
        },
        sage: {
          muted: '#A8B5A5',
          dark: '#7D8C7A',
          light: '#C4CDC2',
        },
        accent: {
          orange: '#C77B43',
          red: '#B65348',
          green: '#667B70',
          amber: '#B8863A',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'Source Sans 3', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-dm-serif)', 'DM Serif Display', 'Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
