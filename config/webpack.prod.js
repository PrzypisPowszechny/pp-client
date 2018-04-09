const path = require('path');
const merge = require('webpack-merge');
const common = require('../webpack.config');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const localPath = (...args) => path.resolve(__dirname, ...args);

module.exports = (env, argv) => merge(common(env, argv), {
  plugins: [
     new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      parallel: true // will use an optimal number of CPUs
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: localPath('src'),
      tslint: true,
    })
  ]
});
