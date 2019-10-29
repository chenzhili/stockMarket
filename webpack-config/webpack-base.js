const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const Frame = process.env.Frame; //如果 有 对应的 框架

const config = {
    // entry: ["./src/core/index.js"],
    output: {
        path: path.resolve(__dirname, "../dist")
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/i,
                exclude: /node_modules/,
                use: [
                    // "happypack/loader?id=happyBabel"
                    'babel-loader'
                ]
            },
            {
                test: /\.scss|css$/i,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                            }
                        }

                    },
                    "sass-loader"
                    /* MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                            }
                        }

                    },
                    // "postcss-loader",
                    "sass-loader" */

                ]
            }
        ]
    },
    performance: {
        hints: "warning", // 枚举
        hints: "error", // 性能提示中抛出错误
        hints: false, // 关闭性能提示
        maxAssetSize: 200000, // 整数类型（以字节为单位）
        maxEntrypointSize: 400000, // 整数类型（以字节为单位）
        assetFilter: function (assetFilename) {
            // 提供资源文件名的断言函数
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {

        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ]
};
switch (Frame) {
    case "Vue":
        config.entry = [path.join(__dirname, "../src/vueCom/index.js")];
        config.module.rules.push({
            test: /\.vue$/,
            loader: 'vue-loader',
            // options: vueLoaderConfig
        });
        config.resolve.alias['vue$'] = 'vue/dist/vue.esm.js';
        config.plugins.push(new VueLoaderPlugin());
        break;
    case "React":
        config.entry = [path.join(__dirname, "../src/reactCom/index.js")];
        break;
    default:
        config.entry = [path.join(__dirname, "../src/core/index.js")];
}

module.exports = config