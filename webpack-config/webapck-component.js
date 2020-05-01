const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack-base.js')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const Coms = require('../component.json')

/* 还未 测试 排除 了 一些东西 能否用，externals 中 到时候 把 引用的 所有 文件 都排除，打包对应 的 相应 文件 到 开发环境 相应的 目录 */

const Frame = process.env.Frame // 如果 有 对应的 框架
const entry = Coms[Frame]

const webpackConfig = merge(commonConfig, {
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    library: 'QLStockMarket',
    libraryTarget: 'umd'
  },
  plugins: [
    // new CleanWebpackPlugin({
    //     cleanOnceBeforeBuildPatterns: ['**/*', '!dll/**'],
    // }),
    new PurgecssPlugin({
      only: ['main'], // 仅对于 这里包含的 css 文件 进行 tree-shaking
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, '..', 'src/**/*.*')
      ])
    })
  ],
  externals: ['jquery', 'hammerjs', 'lodash'],
  optimization: {
    minimize: false
  },
  resolve: {
    aliasFields: ['browser']
  }
})

if (Frame === 'Vue') {
  webpackConfig.externals.push('Vue')
}

if (Frame === 'React') {
  webpackConfig.externals.push('react')
  webpackConfig.externals.push('react-dom')
}

webpackConfig.mode = 'production'
webpackConfig.entry = entry
module.exports = webpackConfig
