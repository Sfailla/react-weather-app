const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

(async () => {
  await imagemin(['./client/src/img/*.{jpg,png}'], {
    destination: './assets/webp',
    plugins: [imageminWebp({ quality: 50 })],
  });
})();

module.exports = {
  entry: './client/src/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
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
      {
        test: /\.(gif|png|jpe?g|svg|webp)$/i,
        include: [path.resolve(__dirname, './assets')],
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
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
    new HtmlWebpackPlugin({
      template: 'client/index.html',
    }),
  ],
};
