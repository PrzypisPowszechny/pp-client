const path = require('path');
const merge = require('webpack-merge');
const common = require('../webpack.config');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const localPath = (...args) => path.resolve(__dirname, ...args);

module.exports = (env, argv) => merge(common.config(env, argv), {
  output: {
    path: common.BUILD_DIR,
    publicPath: './',
    filename: '[name].bundle.js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: localPath('src'),
      tslint: true,
    })
  ]
});
