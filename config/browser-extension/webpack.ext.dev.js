const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');

const common = require('../../webpack.config');
const manifestSettings = require('./manifest');

const manifest = merge(manifestSettings.base, {
  content_scripts: [{
    ...manifestSettings.contentScriptSettings,
    js: [
      // defined in webpack.config.js
      'main.bundle.js',
      'vendor_css.bundle.js'
    ]
  }],
  browser_action: {
    default_icon: 'assets/icon.png',
    default_popup: 'popup.html',
  },
});

module.exports = (env, argv) => merge(common.config(env, argv), {
  entry: {
    popup: './src/browser-extension/popup/popup.tsx',
  },
  output: {
    path: common.EXT_DIR,
    publicPath: 'chrome-extension://hhjfhkdpnajfnekdaigmpahnnoccfaio/',
    filename: '[name].bundle.js',
  },
  plugins: [
    new CreateFileWebpack({
      path: common.EXT_DIR,
      fileName: 'manifest.json',
      content: JSON.stringify(manifest, null, 2),
    }),
    new HtmlWebpackPlugin({
      title: 'Przypis Powszechny -- pomoc',
      template: 'src/browser-extension/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/browser-extension/help',
        to: 'help'
      }
    ])
  ],
});

