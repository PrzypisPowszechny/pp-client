const path = require('path');

const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = require('../../webpack.config');

const BUILD_DIR = path.resolve(__dirname, '..', '..', 'dist-ext');

module.exports = merge(common, {
  entry: {
    popup: "./src/browser-extension/popup.ts",
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Przypis Powszechny -- pomoc',
      template: 'src/browser-extension/popup.html',
      filename: 'popup.html',
    }),
    new CopyWebpackPlugin([
      {
        from: 'config/browser-extension/manifest.json',
        to: 'manifest.json'
      }
    ])
  ],
});
