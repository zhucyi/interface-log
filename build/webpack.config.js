const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  entry: resolve(__dirname, '../src/index.ts'),
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
});
