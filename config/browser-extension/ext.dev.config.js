const merge = require('webpack-merge');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extBaseConfig = require('./ext.base.config');
const devPlugins = require('../dev.plugins');

module.exports = (env, argv) => merge(extBaseConfig.getConfig(env, argv), {
  plugins: [
    ...(
      !argv.watch ? [] : [
        new ChromeExtensionReloader({
          port: 9090, // Which port use to create the server
          reloadPage: true, // Force the reload of the page also
          entries: { //The entries used for the content/background scripts
            contentScript: ['main', 'main_global_styles', 'popup'], //Use the entry names, not the file name or the path
            background: 'background'
          }
        })
      ]
    ),
    new CopyWebpackPlugin([
      {
        from: 'dev-pages',
        to: 'dev-pages'
      }
    ]),
    ...devPlugins,
  ],
});
