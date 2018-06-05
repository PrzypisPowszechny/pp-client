const merge = require('webpack-merge');
const CreateFileWebpack = require('create-file-webpack');

const common = require('./ext.base.config');

// TODO replace with a newly generated key
const KEY = 'hhjfhkdpnajfnekdaigmpahnnoccfaiz';

const manifest = merge(common.manifest, {
  key: KEY,
});

module.exports = (env, argv) => merge(common.config(env, argv), {
  output: {
    publicPath: `chrome-extension://${KEY}/`,
  },
  plugins: [
    // Generate manifest.json
    new CreateFileWebpack({
      path: common.EXT_DIR,
      fileName: 'manifest.json',
      content: JSON.stringify(manifest, null, 2),
    }),
  ]
});

