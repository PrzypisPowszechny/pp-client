const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');

const baseConfig = require('../base.config');
const manifestSettings = require('./manifest');

const loadPPSettings = require('../pp-settings').loadSettings;
const packageConf = require('../../package');


const getManifest = (env, argv) => merge(manifestSettings.base(env, argv), {
  content_scripts: [{
    ...manifestSettings.contentScriptSettings,
    js: [
      // defined in webpack.config.js
      'main.pp-bundle.js',
      'main_global_styles.pp-bundle.js',
    ]
  }],
  background: {
    scripts: ['background.pp-bundle.js'],
  },
  browser_action: {
    default_icon: 'assets/icon.png',
    default_popup: 'popup.html',
  },
  icons: {
    // This size is used in context menu
    '16': 'assets/icon.png',
  },
  key: loadPPSettings(env, argv).DEV ? packageConf.pp.devAppKey : packageConf.pp.prodAppKey
});

const getConfig = (env, argv) => merge(baseConfig.getConfig(env, argv), {
  entry: {
    background: './src/background/background.ts',
    popup: './src/popup/popup.tsx',
  },
  output: {
    path: baseConfig.EXT_DIR,
    filename: '[name].pp-bundle.js',
    publicPath:
      `chrome-extension://${loadPPSettings(env, argv).DEV ? packageConf.pp.devAppID : packageConf.pp.prodAppID}/`,
    // Replacing generic 'webpack://' path with unique one. It is used with (devtools) source maps, otherwise ignored.
    devtoolModuleFilenameTemplate: `pp-webpack://[resource-path]?[loaders]`,
  },
  optimization: {
    splitChunks: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Przypis Powszechny -- menu',
      template: 'src/popup/window.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/pages/help',
        to: 'help'
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: 'src/pages/social_login_demo.html',
        to: 'social_login_demo.html'
      }
    ]),
    // Generate manifest.json
    new CreateFileWebpack({
      path: baseConfig.EXT_DIR,
      fileName: 'manifest.json',
      content: JSON.stringify(getManifest(env, argv), null, 2),
    }),
  ],
});

module.exports = {
  getConfig: getConfig,
  getManifest: getManifest,
  EXT_DIR: baseConfig.EXT_DIR,
};
