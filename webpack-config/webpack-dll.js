
const webpack = require("webpack");
const path = require("path");

const Frame = process.env.Frame; //如果 有 对应的 框架

const config = {
    // entry: ['jquery'],
    output: {
        path: path.resolve(__dirname, "..", "dll"),
        filename: "dll_[name].js",
        library: "[name]_[hash]"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "..", "dll/[name]-manifest.json"),
            name: "[name]_[hash]"
        })
    ]
}
config.entry = ['jquery', 'lodash', 'hammerjs'];
switch (Frame) {
    case "Vue":
        config.entry.push('vue');
        break;
    case "React":
        config.entry.push('react');
        config.entry.push('react-dom');
        break;
    default:
        break;
}

module.exports = config;