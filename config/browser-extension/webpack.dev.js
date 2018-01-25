const common = require('../../webpack.config');

const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
    new HtmlWebpackPlugin({
      title: 'Przypis Powszechny -- pomoc',
      template: 'src/browser-extension/popup/popup.html',
      filename: 'popup.html',
      chunks: ['vendor', 'popup']
    }),
    new CopyWebpackPlugin([
      {
        from: 'config/browser-extension/manifest.json',
        to: 'manifest.json'
      },
      {
        from: 'src/browser-extension/help',
        to: 'help'
      }
    ])
  ],
});
