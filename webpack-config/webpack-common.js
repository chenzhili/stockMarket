const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack-base.js')

const webpackConfig = merge(commonConfig, {
  entry: {
    'core/index.js': path.join(__dirname, '..', '/src/core/index.js'),
    'enums/index.js': path.join(__dirname, '..', '/src/enums/index.js'),
    'events/index.js': path.join(__dirname, '..', '/src/events/index.js'),
    'utils/index.js': path.join(__dirname, '..', '/src/utils/index.js')
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
    library: 'QLStockMarket',
    libraryTarget: 'umd'
  },
  plugins: [

  ],
  resolve: {
    aliasFields: ['browser']
  }
})

webpackConfig.mode = process.env.MINIFY && process.env.MINIFY === 'true' ? 'production' : 'development'
module.exports = webpackConfig
