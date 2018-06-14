const merge = require('webpack-merge');
const CreateFileWebpack = require('create-file-webpack');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

const common = require('./ext.base.config');

// An arbitrary key used for development; controlling it, we control the app id, which is generated from the key.
// Otherwise the key will be automatically generated along with the app id and we would have to update our publicPath
// in the runtime, which proves to be hard in case of a browser extension
const KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtxq8nV/aj5t9OCS5BaRfNNVdEYFqSYCfgSRmXzizAGCoIfro6bewIL3tFP4aIkreQHg4/09Xiv6TSJ7ZiFnuVat5iYGC3w1h+z9fzj/i0lyASilp0N7watpAGLh+msGzr59J/lGR7G0Nt3Ixy82RBlLmU5gjR9eHueOMNaUe1m4I74BSPG6GboUmUpidaqAbSV3lgYFppWHDjCQ5rqIkue1JLAsRBwiV+3DeGJs3JN+TfLduEgDzMcNuCkFdym1L+9qJKQI6t56ElkHMse3aToSTrG0flPedfCpPgEcGKfkgDxO11de7hKrRcbX4wmQzACvBm1YzzrLRR7yIRBhFEQIDAQAB';
const APP_ID = 'lkdlhhnnkbhhnocdodbeikfboeckpaih';

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
    new ChromeExtensionReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: { //The entries used for the content/background scripts
        contentScript: ['main', 'vendor_css', 'popup'], //Use the entry names, not the file name or the path
        background: 'background'
      }
    })
  ]
});

