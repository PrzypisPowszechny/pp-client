const merge = require('webpack-merge');
const common = require('../webpack.config');
// const UglifyJsPlugin = require('webpack.optimize.UglifyJsPlugin');
const webpack = require('webpack');

module.exports = merge(common, {
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
  ],
});
