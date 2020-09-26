const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack-base.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')

// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

// module.exports = merge(commonConfig, {
//     mode: "production",
//     output: {
//         // 输出目录
//         path: path.resolve(__dirname, "../dist"),
//         // 文件名称
//         filename: 'test-czl.js',
//         // chunkFilename: '[name].[contenthash].js',
//         library: "testCZL",
//         libraryTarget: "umd",
//     },
//     plugins: [
//         new CleanWebpackPlugin({
//             cleanOnceBeforeBuildPatterns: ['**/*', '!dll/**'],
//         }),
//         new PurgecssPlugin({
//             only: ['main'], //仅对于 这里包含的 css 文件 进行 tree-shaking
//             paths: glob.sync([
//                 // 要做 CSS Tree Shaking 的路径文件
//                 path.resolve(__dirname, '..', 'src/**/*.*'),
//             ]),
//         }),
//         // /* 引入公共库 */
//         // new webpack.DllReferencePlugin({
//         //     manifest: require(path.resolve(__dirname, "../dll/main-manifest.json"))
//         // }),
//         /* new AddAssetHtmlPlugin({
//             filepath: path.resolve(__dirname, "..", "dll/dll_main.js"),
//         }), */
//     ],
// });
let jsFileName = 'ql-stockmarket.min.js'
if (process.env.MINIFY && process.env.MINIFY === 'false') {
  jsFileName = 'ql-stockmarket.js'
}
const webpackConfig = merge(commonConfig, {
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: jsFileName,
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
  resolve: {
    aliasFields: ['browser']
  },
  target: 'web',
  /* 这句配置就能让 eval 函数消失 */
  /* 
    https://github.com/webpack/webpack/issues/5627 
    Edit: Using webpack 4.1.1 with an explicit override of devtool: 'inline-source-map' to disable the default eval source-map for the development environment, I'm successfully able to produce an eval-less output for both production and development environments.
  */
  devtool: false
})

webpackConfig.mode = process.env.MINIFY && process.env.MINIFY === 'true' ? 'production' : 'development'
module.exports = webpackConfig
