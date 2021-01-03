const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.vue'
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      white: colors.white,
      gray: colors.trueGray,
      teal: colors.teal,
      blue: colors.blue,
      black: colors.black,
      indigo: colors.indigo,
      amber: colors.amber,
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
