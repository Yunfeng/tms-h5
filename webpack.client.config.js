// var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseWebpackConfig, {
  entry: './src/entry-client.js',
  output: {
    filename: '[name].js'
  },
  plugins: [
  	new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    new VueSSRClientPlugin()
  ]
})
