const path = require('path');

const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

// app-specific settings (enabled features etc.)
const { appSettings } = require('./config/app-settings');

const BUILD_DIR = path.resolve(__dirname, 'dist');

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
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, enforce: 'pre', loader: 'tslint-loader', },
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
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
