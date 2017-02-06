var path = require('path');
var fs = require('fs-extra');
var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var IndexHtmlPlugin = require('indexhtml-webpack-plugin');
var cssExtractPlugin = new ExtractTextPlugin('styles/[contenthash:16].css');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");


var DebugWebpackPlugin = require('debug-webpack-plugin');
var path = require('path');

var codeFolderPath = 'src';

var webpackConfiguration = {
	context : __dirname,
	entry : {
		app : [ './' + codeFolderPath + '/index.js' ]
	},
	output : {
		path : path.join(__dirname, 'static/'),
		filename : 'expresspoll.js'
	},
	module : {
		loaders : [
				{
					test : /^index\.html$/,
					loader : 'html'
				},
				{
					test : /\.css$/,
					loader : cssExtractPlugin.extract('style', 'css')
				},
				{
					test : /\.js$/,
					loader : 'babel-loader'
				},
				{
					test : /\.json$/,
					loader : 'json-loader'
				},
				{
					test : /\.html$/,
					loaders : [
							"file-loader?context=src&name=[path][name].[ext]",
							"extract-loader", 'html' ]
				},
				{
					test : /\.ttl$/,
					loaders : [
							"file-loader?context=src&name=[path][name].[ext]",
							"extract-loader",'raw-loader' ]
				},
				{
					test : /\.png$/,
					loaders : [ 'file-loader']
				}, {
					test : /(\.(?:eot|woff|woff2|ttf|svg))/,
					loader : 'file-loader?name=font/[name].[ext]'
				}, {
					test : /\.(jpe?g|png|gif)$/,
					loader : 'file-loader?name=img/[name].[ext]'
				} ]
	},
	plugins : [ 
	        	
	  new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false},  mangle:false 
    }),      
	           
	            cssExtractPlugin, new ExtractTextPlugin("[name].css")
  , new webpack.ProvidePlugin({  
    _: require.resolve('lodash')

  })
	            
	, new DebugWebpackPlugin({

		// Defaults to ['webpack:*'] which can be VERY noisy, so try to be
		// specific
		scope : [ 'webpack:compiler:*', // include compiler logs
		'webpack:plugin:*' // include a specific plugin's logs
		],

		// Inspect the arguments passed to an event
		// These are triggered on emits
		listeners : {
			'webpack:compiler:run' : function(compiler) {
				// Read some data out of the compiler
			}
		},
		// Defaults to the compiler's setting
		debug : true
	}), new HtmlWebpackPlugin({
		inject : false,
		template : require('path').join(__dirname, './src/roottemplate.ejs')
		,
		title : "Express Poll",
		hash : true
	})
	  ,new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
	  
	  
	  ],
	resolve : {
		alias : {
			xmlhttprequest : __dirname + '/' + codeFolderPath
					+ '/xmlhttprequest_shim.js'
             ,resources: path.resolve(__dirname, './src/resources')
             ,schemaForm:path.resolve('./bower_components/angular-schema-form/dist/schema-form.js') 
              
		}
    ,	 modulesDirectories:[path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'bower_components') ]  
	}
};

//module.exports = function(onBuildEndScripts) {
//	return webpackConfiguration;
// };

module.exports = webpackConfiguration;