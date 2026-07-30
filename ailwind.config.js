/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-soft': '#d6e8f0',
        'coastal': '#7fa9b9',
        'deep-blue': '#2c5f6e',
        'creamy': '#fcf8f3',
        'warm-sand': '#f2ece4',
        'soft-stone': '#8a8a8a',
        'ocean-mist': '#b5d1d9',
        'dark-stone': '#4a4a4a',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}