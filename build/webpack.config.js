const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(base, {
  // mode: 'development',
  devtool: false,
  entry: resolve(__dirname, '../src/index.ts'),
  output: {
    filename: 'interface-log.js',
    path: resolve(__dirname, '../dist'),
    library: 'InterfaceLog',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '../src/interface-log.d.ts'),
          to: resolve(__dirname, '../dist/interface-log.d.ts'),
        },
      ],
    }),
  ],
  // optimization: {
  //   chunkIds: 'named', // To keep filename consistent between different modes (for example building only)
  // },
});
