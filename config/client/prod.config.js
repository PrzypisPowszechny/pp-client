const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const common = require('../base.config');

const localPath = (...args) => path.resolve(__dirname, ...args);

module.exports = (env, argv) => merge(common.getConfig(env, argv), {
  output: {
    path: common.BUILD_DIR,
    publicPath: './',
    filename: '[name].pp-bundle.js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: localPath('src'),
      tslint: true,
    })
  ]
});
