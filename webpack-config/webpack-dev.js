const path = require("path");
const merge = require('webpack-merge')
const commonConfig = require('./webpack-base.js')
const webpack = require("webpack");

module.exports = merge(commonConfig, {
    mode: "development",
    devtool: 'cheap-module-eval-soure-map',
    output: {
        // 输出目录
        path: path.resolve(__dirname, "../example"),
        // 文件名称
        filename: "bundle.js",
        chunkFilename: '[name].js'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, "../example"),
        host: "localhost", // 可以使用手机访问
        port: 8777,
        historyApiFallback: true, //  该选项的作用所有的404都连接到index.html
        proxy: {
            // 代理到后端的服务地址
            "/api": "http://localhost:3000"
        }
    },
    resolve: {
        alias: {}
    },
});
