/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Source Sans Pro', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#D9534F',
          'red-hover': '#C9302C',
        }
      }
    },
  },
  plugins: [],
}

