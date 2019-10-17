const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: ["./src/core/index.js"],
    output: {
        path: path.resolve(__dirname, "../dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
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
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {

        }
    },
    plugins: [
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns: ['**/*', '!dll/**'],
        // }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ]
}