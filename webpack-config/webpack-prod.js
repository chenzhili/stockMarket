const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge')
const commonConfig = require('./webpack-base.js')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = merge(commonConfig, {
    mode: "production",
    output: {
        // 输出目录
        path: path.resolve(__dirname, "../dist"),
        // 文件名称
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js'
    },
    devtool: 'cheap-module-source-map',
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors'
                },
            }
        },
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll/**'],
        }),
        new PurgecssPlugin({
            only: ['main'], //仅对于 这里包含的 css 文件 进行 tree-shaking
            paths: glob.sync([
                // 要做 CSS Tree Shaking 的路径文件
                path.resolve(__dirname, '..', 'src/**/*.*'),
            ]),
        }),
        // /* 引入公共库 */
        // new webpack.DllReferencePlugin({
        //     manifest: require(path.resolve(__dirname, "../dll/main-manifest.json"))
        // }),
        /* new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname, "..", "dll/dll_main.js"),
        }), */
    ],
});
