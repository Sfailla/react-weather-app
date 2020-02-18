const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
		})
	]
};
