const merge = require('webpack-merge');
const CreateFileWebpack = require('create-file-webpack');

const common = require('./ext.base.config');

// Constant key and id from our production setting
const KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArkmF/06jK2b976qLc1RoSyrhGMN1QkbRCbDLnMGL+RfOlZdbDBwXxtTXcnzm2uwUlrZKCaecuD0GOrnOfihaqQv3cVRbRTCWhvyhswqiWea8YA8P0pjiTrsuth6l0NK9WqKYLTUxP+oM9H0nDaOg5I9Jzh5kCZPpwavbx1naXCv7PPcIoGNRgA4y3YJL8qiJx9eY0I6yRdCSS8JX4AeZ4K1ShnzPg5Wih7NZdJlmWCjOajdF8GHxYGt68eGOamIlQYwFzAjinCN+DbI1f4suQcq5oJzw3NCBmCvepaw5f/ivhzCsw0aRfVqRk6EVxhQvRwTBxeBQQ28j5JecxtfN5wIDAQAB'
// App id is generated deterministically from the app key
const APP_ID = 'afephghdinbdpfmfdkgbhbolflhnbbdf';

const manifest = merge(common.manifest, {
  key: KEY,
});

module.exports = (env, argv) => merge(common.config(env, argv), {
  output: {
    publicPath: `chrome-extension://${APP_ID}/`,
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

