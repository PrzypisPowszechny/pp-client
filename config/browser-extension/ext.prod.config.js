const merge = require('webpack-merge');

const extBaseConfig = require('./ext.base.config');

module.exports = (env, argv) => merge(extBaseConfig.getConfig(env, argv), {
  /* no extra settings */
});
