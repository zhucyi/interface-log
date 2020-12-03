const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  output: {
    filename: 'interface-log.js',
    path: resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        // use: ['babel-loader', 'ts-loader'],
        // use: ['ts-loader'],
        use: ['babel-loader'],
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
