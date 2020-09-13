const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ["./src/game.tsx", "./src/game.scss"],
  devtool: "inline-source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                outputStyle: "compressed"
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["tsx", "ts", "js", "scss", "sass", "css"]
  },
  output: {
    filename: "game.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "game.css",
      chunkFilename: "game.css",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/dist/"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
