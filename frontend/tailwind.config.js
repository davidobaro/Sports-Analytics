/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nba-blue': '#1d428a',
        'nba-red': '#c8102e',
        'nba-silver': '#c4ced4',
      },
      fontFamily: {
        'nba': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
