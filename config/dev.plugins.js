/****
 * Config part shared among dev configurations
 */

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin({
    async: true,
    watch: 'src',
    tslint: true,
  }),
  new ForkTsCheckerNotifierWebpackPlugin({
    excludeWarnings: true
  })
];
