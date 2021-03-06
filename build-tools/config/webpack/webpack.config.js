/**
 * Webpack config used during development
 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const {
	getStyleRules,
	getCodeRules,
	getHandlebarsRules,
	getDirectoryNamedWebpackPlugin,
} = require('./webpack-helpers');

const projectRoot = path.resolve(__dirname, '../../../');

module.exports = {
	entry: {
		main: [
			// bundle the client for webpack-dev-server
			// and connect to the provided endpoint
			'webpack-dev-server/client?http://localhost:9000',
			// bundle the client for hot reloading
			// only- means to only hot reload for successful updates
			'webpack/hot/only-dev-server',
			'./src/app/polyfills.js',
			'./src/app/dev.js',
		],
	},
	output: {
		path: path.resolve(projectRoot, 'build'),
		filename: 'asset/[name].js',
		publicPath: '/',
	},
	resolve: {
		extensions: ['.hbs', '.ts', '.js', '.json'],
		modules: [
			path.resolve(projectRoot, 'src'),
			'node_modules',
		],
		plugins: [
			getDirectoryNamedWebpackPlugin()
		],
		alias: {
			modernizr$: path.resolve(projectRoot, '.modernizrrc')
		},
	//	 fallback: path.join(__dirname, "helpers")
	},
	module: {
		rules: [
			...getHandlebarsRules(true),
			...getCodeRules(),
			...getStyleRules(true),
			{
				test: /\.js$/,
				enforce: 'pre',
				loader: 'source-map-loader'
			},
		]
	},
	devServer: {
		hot: true,
		contentBase: path.join(projectRoot, 'src/static'),
		publicPath: '/',
		compress: true,
		host: '0.0.0.0',
		port: 9000,
		disableHostCheck: true,
		overlay: true,
		setup(app) {
			// render basic default index.html for all html files (path will be picked by JS)
			app.use((req, res, next) => {
				if (req.path.includes('.html')) {
					res.send(fs.readFileSync(path.resolve(projectRoot, 'index.html'), 'utf-8'));
				} else {
					next();
				}
			});

			// also render index.html on /
			app.get('/', function(req, res) {
				res.send(fs.readFileSync(path.resolve(projectRoot, 'index.html'), 'utf-8'));
			});
		}
	},
	plugins: [
		// enable HMR globally
		new webpack.HotModuleReplacementPlugin(),

		// prints more readable module names in the browser console on HMR updates
		new webpack.NamedModulesPlugin(),
	],
	devtool: 'eval-source-map'
};
