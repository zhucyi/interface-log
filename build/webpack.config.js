const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');
const { resolve } = require('path');

module.exports = merge(base, {
  entry: resolve(__dirname, '../src/index.ts'),
});
