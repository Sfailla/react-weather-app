const path = require('path');

module.exports = {
	entry: './client/src/app.js',
	output: {
		path: path.resolve(__dirname, 'client'),
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
				use: [ 'style-loader', 'css-loader', 'sass-loader' ]
			}
		]
	},
	devtool: 'eval-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'client')
	}
};
