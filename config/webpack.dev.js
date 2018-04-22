const path = require('path');
const merge = require('webpack-merge');
const common = require('../webpack.config');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const webpack = require('webpack');

const localPath = (...args) => path.resolve(__dirname, ...args);

module.exports = (env, argv) => merge(common.config(env, argv), {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '/dist',
    compress: true,
    inline: true,
    hot: true,
    overlay: true,
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      watch: localPath('src'),
      tslint: true,
    }),
    new ForkTsCheckerNotifierWebpackPlugin({
      excludeWarnings: true
    })
  ],
});
