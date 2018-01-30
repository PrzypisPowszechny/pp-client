const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');

// app-specific settings (enabled features etc.)
const { appSettings } = require('./config/app-settings');

const localPath = (...args) => path.resolve(__dirname, ...args);

const BUILD_DIR = localPath('dist');
const EXT_DIR = localPath('dist-ext');

const config = {
  entry: {
    main: "./src/index.ts",
    vendor: "./src/vendor.ts",
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
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
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
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
          localPath('src', 'browser-extension'),
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
                localPath('src'),
              ],
            },
          }],
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
    new CleanWebpackPlugin([BUILD_DIR, EXT_DIR]),
    new HtmlWebpackPlugin({
      title: 'Przypis testowa pusta strona',
      template: 'src/test.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      // use appropriate (dev or production) PP settings
      PP_SETTINGS: appSettings[process.env.NODE_ENV || 'dev']
    }),
    // JQuery is assumed by semantic ui, so we need to define it
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: localPath('src'),
      tslint: true,
    }),
  ],
};

module.exports = config;
