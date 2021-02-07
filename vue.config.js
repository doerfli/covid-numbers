module.exports = {
  publicPath: process.env.DIST_SUBDIR !== undefined
    ? process.env.DIST_SUBDIR
    : '/',
  configureWebpack: {
    "devtool": "source-map"
  },
  pluginOptions: {
    sitemap: {
      urls: [
        'https://covid19-data.ch/',
        'https://covid19-data.ch/#/confirmedcases',
        'https://covid19-data.ch/#/hospitalized',
        'https://covid19-data.ch/#/icu',
        'https://covid19-data.ch/#/deceased',
        'https://covid19-data.ch/#/incidence-7-days',
        'https://covid19-data.ch/#/incidence-14-days',
        'https://covid19-data.ch/#/trend',
      ],
      defaults: {
        changefreq: 'daily',
      },
    }
  }
}
