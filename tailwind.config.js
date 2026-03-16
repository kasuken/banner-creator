export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#141414',
          raised: '#1a1a1a',
          overlay: '#222222',
          border: '#2a2a2a',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          dim: '#a09a90',
          muted: '#6b6660',
        },
        copper: {
          DEFAULT: '#c47d5a',
          light: '#d4996e',
          dark: '#a0614a',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};