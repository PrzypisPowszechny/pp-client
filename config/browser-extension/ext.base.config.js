const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');

const common = require('../base.config');
const manifestSettings = require('./manifest');

const manifest = (env, argv) => merge(manifestSettings.base(env, argv), {
  content_scripts: [{
    ...manifestSettings.contentScriptSettings,
    js: [
      // defined in webpack.config.js
      'main.bundle.js',
      'main_global_styles.bundle.js',
    ]
  }],
  background: {
    scripts: ['background.bundle.js'],
  },
  browser_action: {
    default_icon: 'assets/icon.png',
    default_popup: 'popup.html',
  },
  icons: {
    // This size is used in context menu
    '16': 'assets/icon.png',
  }
});

const config = (env, argv) => merge(common.config(env, argv), {
  entry: {
    background: './src/background/background.ts',
    popup: './src/popup/popup.tsx',
  },
  output: {
    path: common.EXT_DIR,
    filename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Przypis Powszechny -- pomoc',
      template: 'src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/pages/help',
        to: 'help'
      }
    ])
  ],
});

module.exports = {
  config: config,
  manifest: manifest,
  EXT_DIR: common.EXT_DIR,
};
