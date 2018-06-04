const path = require('path');
const merge = require('webpack-merge');
const common = require('./base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
  // default Webpack settings
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Przypis testowa pusta strona',
      template: 'src/test.html',
      filename: 'index.html',
    }),
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
