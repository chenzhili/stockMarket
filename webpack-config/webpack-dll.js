
const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: ['jquery'],
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