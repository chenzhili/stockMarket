const path = require("path");
const merge = require('webpack-merge')
const commonConfig = require('./webpack-base.js')
const webpack = require("webpack");

const Frame = process.env.Frame; //如果 有 对应的 框架

const config = merge(commonConfig, {
    mode: "development",
    devtool: 'cheap-module-eval-source-map',
    output: {
        // 输出目录
        // path: path.resolve(__dirname, "../example"),
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
        // contentBase: path.resolve(__dirname, "../example"),
        host: "0.0.0.0", // 可以使用手机访问
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
switch (Frame) {
    case "Vue":
        config.output.path = path.resolve(__dirname, "../example/vue");
        config.devServer.contentBase = path.resolve(__dirname, "../example/vue");
        break;
    case "React":
        config.output.path = path.resolve(__dirname, "../example/react");
        config.devServer.contentBase = path.resolve(__dirname, "../example/react");
        break;
    default:
        config.output.path = path.resolve(__dirname, "../example/core");
        config.devServer.contentBase = path.resolve(__dirname, "../example/core");
}

module.exports = config;
