const path = require('path');

const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = require('../../webpack.config');

const BUILD_DIR = path.resolve(__dirname, '..', '..', 'dist-ext');

module.exports = (env, argv) => merge(common.config(env, argv), {
  entry: {
    popup: "./src/browser-extension/popup/popup.tsx",
  },
  output: {
    path: BUILD_DIR,
    publicPath: 'chrome-extension://hhjfhkdpnajfnekdaigmpahnnoccfaio/',
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Przypis Powszechny -- pomoc',
      template: 'src/browser-extension/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
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
