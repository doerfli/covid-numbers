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
      purple: colors.purple,
      indigo: colors.indigo,
      teal: colors.teal,
      blue: colors.blue,
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
