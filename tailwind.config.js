/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C4983A',
          light: '#E8C568',
          dark: '#9B7420',
          pale: 'rgba(196,152,58,0.12)',
        },
        silver: {
          DEFAULT: '#8B8FA8',
          light: '#C0C4D6',
          pale: 'rgba(139,143,168,0.12)',
        },
        // "dark" keys now = LIGHT cream surfaces (all classnames stay, colors flip)
        dark: {
          DEFAULT: '#F7F4EF',   // warm cream body
          card: '#FFFFFF',       // white cards
          section: '#F1EDE5',   // alternating cream section
          elevated: '#FAFAF8',  // slightly lifted surface
          border: '#E4DECC',    // warm light border
        },
        // "ink" keys now = DARK anthracite text (was cream)
        ink: {
          DEFAULT: '#1A1D24',   // near-black anthracite
          mid: '#52566B',       // medium dark
          soft: '#7A7F94',      // muted dark
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        hebrew: ['"Arial Hebrew"', '"David"', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'spark': 'spark 0.55s ease-out forwards',
        'kinetic': 'kineticDrift 22s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        spark: {
          '0%':   { opacity: '0', color: '#E8C568', textShadow: '0 0 24px rgba(232,197,104,1)' },
          '35%':  { opacity: '1', color: '#E8C568', textShadow: '0 0 12px rgba(196,152,58,0.5)' },
          '100%': { opacity: '1', color: 'inherit', textShadow: 'none' },
        },
        kineticDrift: {
          '0%':   { transform: 'translate(-4%, 0%) rotate(-2deg) scale(1)' },
          '50%':  { transform: 'translate(3%, -3%) rotate(1deg) scale(1.05)' },
          '100%': { transform: 'translate(-2%, 4%) rotate(-1deg) scale(0.97)' },
        },
      },
    },
  },
  plugins: [],
}
