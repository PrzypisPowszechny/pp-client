const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');

const common = require('./ext.base.config');

module.exports = (env, argv) => merge(common.config(env, argv), {
  output: {
    // TODO insert true chrome store key when generated
    publicPath: 'chrome-extension://hhjfhkdpnajfnekdaigmpahnnoccfaio/',
  },
});
