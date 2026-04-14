/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'refox-green': '#00E396',
        'refox-dark': '#000000',
        'refox-gray': '#111111',
        'refox-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00E396, 0 0 10px #00E396' },
          '100%': { boxShadow: '0 0 20px #00E396, 0 0 30px #00E396' },
        }
      }
    },
  },
  plugins: [],
}
