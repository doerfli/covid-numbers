const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.vue'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      white: colors.white,
      gray: colors.trueGray,
      teal: colors.teal,
      blue: colors.blue,
      black: colors.black,
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
