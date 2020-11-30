const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');

module.exports = {
  mode: 'development',
  entry: resolve(__dirname, '../src/index.ts'),
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /.tsx?/,
        use: 'ts-loader',
        exclude: '/node_modules',
      },
      {
        test: /.html?/,
        use: 'html-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  devServer: {
    contentBase: resolve(__dirname, '../dist'),
    compress: true,
    port: 9000,
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
