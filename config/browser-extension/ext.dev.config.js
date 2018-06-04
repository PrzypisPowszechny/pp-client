const merge = require('webpack-merge');
const CreateFileWebpack = require('create-file-webpack');

const common = require('./ext.base.config');

// An arbitrary key used for development; if we do not set it, it will be automatically generated and we would have to
// update our publicPath in the runtime, which proves to be hard in case of a browser extension
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

