module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/covid-numbers/'
    : '/',
  configureWebpack: {
    "devtool": "source-map"
  }
}
