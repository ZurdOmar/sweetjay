export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#39ff14',
          blue: '#00f3ff',
          purple: '#bc13fe',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#121212',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
