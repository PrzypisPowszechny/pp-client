const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

// app-specific settings (enabled features etc.)
const {loadSettings} = require('./pp-settings');

const localPath = (...args) => path.resolve(__dirname, ...args);

const ROOT = localPath('..');
const BUILD_DIR = localPath(ROOT, 'dist', 'client');
const EXT_DIR = localPath(ROOT, 'dist', 'browser-extension');

const getConfig = (env, argv) => ({
  entry: {
    main: "./src/content-scripts/main.tsx",
    main_global_styles: "./src/content-scripts/main-global-styles.ts"
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].pp-bundle.js',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: [
      localPath(ROOT, 'src'),
      localPath(ROOT, 'node_modules'),
    ],
    // use alias so all dependencies use jquery-slim too
    // jquery-slim doesn't include ajax and animated side-effects
    alias: {
      'jquery': 'jquery-slim/dist/jquery.slim.min',
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        include: localPath(ROOT, 'src'),
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          }
        ],
        exclude: /node_modules/,
      },
      {
        /* CSS global styles */
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        /* SCSS global content script & popup styles */
        test: /\.scss$/,
        include: [
          localPath(ROOT, 'src', 'css'),
          localPath(ROOT, 'src', 'popup', 'css'),
        ],
        use: [
          'style-loader',
          'css-loader',
          'cssimportant-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                localPath(ROOT, 'src'),
              ],
            },
          }
        ],
      },
      {
        /* SCSS modules */
        test: /\.scss$/,
        include: [
          localPath(ROOT, 'src', 'content-scripts', 'components'),
          localPath(ROOT, 'src', 'popup', 'components'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                localPath(ROOT, 'src'),
              ],
            },
          }
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]'
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
        },
      },
    ],
  },
  plugins: [
    // a recommended hack to only build selected languages in momentjs
    // (https://medium.com/@michalozogan/how-to-split-moment-js-locales-to-chunks-with-webpack-de9e25caccea)
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      // use appropriate (development or production) PP settings
      PPSettings: JSON.stringify(loadSettings(env, argv)),
    }),
    // JQuery is assumed by semantic ui, so we need to define it
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ],
});

module.exports = {
  getConfig: getConfig,
  BUILD_DIR: BUILD_DIR,
  EXT_DIR: EXT_DIR,
};
