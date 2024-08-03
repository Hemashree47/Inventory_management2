/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/images/bg.jpeg')",
      },
      colors: {
        'mint': '#77E4C8', // Define your custom color
      },
    },
  },
  plugins: [],
}

