/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-900': '#1e3a8a',
        'blue-100': '#dbeafe',
        'blue-50': '#eff6ff',
        'white-custom': '#ffffff',
      },
      fontFamily: {
        sans: ['Gill Sans Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
}