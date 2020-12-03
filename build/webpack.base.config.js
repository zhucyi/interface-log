const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /.tsx?/,
        use: ['ts-loader'],
        exclude: '/node_modules',
      },
      {
        test: /.html$/,
        use: 'html-loader',
      },
      {
        test: /.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [new CleanWebpackPlugin()],
};
