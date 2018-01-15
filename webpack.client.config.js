var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.config')

module.exports = merge(baseWebpackConfig, {
  entry: './src/entry-client.js',
  output: {
    filename: 'client.build.js'
  }
})
