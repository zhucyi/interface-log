const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.config');
const { resolve } = require('path');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: resolve(__dirname, '../src/dev/index.ts'),
  devServer: {
    contentBase: resolve(__dirname, '../dist'),
    compress: true,
    host: '0.0.0.0',
    port: 9000,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
});
