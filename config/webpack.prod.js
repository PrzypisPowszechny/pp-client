const merge = require('webpack-merge');
const common = require('../webpack.config');
const webpack = require('webpack');

module.exports = merge(common, {
  plugins: [
     new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      parallel: true // will use an optimal number of CPUs
    }),
  ]
});
