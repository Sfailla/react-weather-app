const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './client/src/app.js',
  output: {
    path: path.resolve(__dirname, './client'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              'transform-class-properties',
              'babel-plugin-transform-runtime',
            ],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  devtool: isDevelopment ? 'cheap-module-eval-source-map' : 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'client'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env': {
        GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
        WEATHER_API_KEY: JSON.stringify(process.env.WEATHER_API_KEY),
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};
