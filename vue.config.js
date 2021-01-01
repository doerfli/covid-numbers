module.exports = {
  publicPath: process.env.DIST_SUBDIR !== undefined
    ? process.env.DIST_SUBDIR
    : '/',
  configureWebpack: {
    "devtool": "source-map"
  }
}
