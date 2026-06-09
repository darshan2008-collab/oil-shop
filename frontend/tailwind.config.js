/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a24',
        primaryDark: '#0f2214',
        secondary: '#2d5a27',
        accent: '#c5a059',
        cream: '#fdfbf7',
        creamDark: '#f4efe6',
        light: '#f8f9fa',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
