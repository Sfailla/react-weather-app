const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

console.log(path.resolve(__dirname, 'client'));

module.exports = {
	entry: './client/src/app.js',
	output: {
		path: path.resolve(__dirname, './client'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ 'env' ],
						plugins: [
							'transform-class-properties',
							'babel-plugin-transform-runtime'
						]
					}
				}
			},
			{
				test: /\.s?css$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	},
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'client')
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style.css'
		}),
		new Dotenv(),
		new webpack.DefinePlugin({
			'process.env': {
				GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
				WEATHER_API_KEY: JSON.stringify(
					process.env.OPEN_WEATHER_API_KEY
				)
			}
		})
	]
};
