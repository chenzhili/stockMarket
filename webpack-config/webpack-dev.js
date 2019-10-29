const path = require("path");
const merge = require('webpack-merge')
const commonConfig = require('./webpack-base.js')
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const Frame = process.env.Frame; //如果 有 对应的 框架
let htmlSrc = "../example/core/index.html";
if (Frame === "Vue") {
    htmlSrc = "../example/vue/index.html"
};
if (Frame === "React") {
    htmlSrc = "../example/react/index.html"
}
const config = merge(commonConfig, {
    mode: "development",
    devtool: 'cheap-module-eval-source-map',
    output: {
        // 输出目录
        path: path.resolve(__dirname, "../dist"),
        // 文件名称
        filename: "bundle.js",
        chunkFilename: '[name].js'
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll/**'],
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, htmlSrc),
            minify: {
                collapseWhitespace: false // 去除空白
            }
        })
    ],
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, "../dist"),
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
        config.entry = [path.join(__dirname, "../example/vue/index.js")];
        break;
    case "React":
        config.entry = [path.join(__dirname, "../example/react/app.js")];
        break;
    default:
        config.entry = [path.join(__dirname, "../example/core/index.js")];
}


/* switch (Frame) {
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
} */

module.exports = config;
