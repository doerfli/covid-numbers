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
      black: colors.black,
      teal: colors.teal,
      blue: colors.blue,
      indigo: colors.indigo,
      emerald: colors.emerald,
      pink: colors.pink
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
