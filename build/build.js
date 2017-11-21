require('./check-versions')()

process.env.NODE_ENV = 'production'

var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

console.log(chalk.cyan('Building for production...\n'))

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err

  webpack(webpackConfig, function (err, stats) {
    if (err) throw err

    //process.stdout.write(stats.toString("verbose")

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }))

    console.log(chalk.cyan('\n\nBuild complete.\n'))
  })
})
