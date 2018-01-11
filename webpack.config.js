const path = require('path');

const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

// app-specific settings (enabled features etc.)
const { appSettings } = require('./config/app-settings');

const BUILD_DIR = path.resolve(__dirname, 'dist');

const localPath = (...args) => path.resolve(__dirname, ...args);

const config = {
  cache: false,
  entry: "./src/index.ts",
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    modules: [
      localPath('src'),
      localPath('node_modules'),
    ]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, enforce: 'pre', loader: 'tslint-loader', },
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      {
        /* CSS global styles */
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        /* SCSS global styles */
        test: /\.scss$/,
        include: [
          localPath('src', 'css'),
        ],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        /* SCSS modules */
        test: /\.scss$/,
        include: [
          localPath('src', 'pp-annotator')
        ],
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              namedExport: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                localPath('src'),
              ],
            },
          }],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([BUILD_DIR]),
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      title: 'Przypis testowa pusta strona',
      template: 'src/test.html',
    }),
    new webpack.DefinePlugin({
      // use appropriate (dev or production) PP settings
      PP_SETTINGS: appSettings[process.env.NODE_ENV || 'dev']
    }),
    new webpack.ProvidePlugin({
            jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery'
    })
  ],
};

module.exports = config;
