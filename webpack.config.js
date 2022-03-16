// to get the absolute path
const pathModule = require("path");
// loader to serve our app on an html file
const HtmlWebpackPlugin = require("html-webpack-plugin");
// minimize imgs as gulp
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
// loader for sass or scss
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// loader for css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// export the config for npx webpack command to exec
module.exports = {
	// select the working mode ( development or production)
	mode: "production",
	// select the app entry point for the webpack to start following all the import branches
	entry: "./src/index.js",

	output: {
		// naming the output file as wanted
		filename: "bundle.js",
		// the target directory for all output files
		// must be an ***absolute path*** (use the Node.js path module)
		// so we used node path lib to make it simple
		path: pathModule.resolve(__dirname, "Hamada"),
		assetModuleFilename: "images/[name][ext]",
	},
	module: {
		rules: [
			//css files
			// match each file with .css and use css loader with it
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			//images
			// match each file with img extension and save it in asset/resource file in the build
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
			// match each file with .scss OR .sass and use sass loader with it
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
		],
	},
	plugins: [
		// make instance of the html plugin / i used it for production
		new HtmlWebpackPlugin(),
		// make instance of the scss or sass plugin
		new MiniCssExtractPlugin(),
		// make instance of the css plugin
		new CssMinimizerPlugin(),
	],
	optimization: {
		minimizer: [
			//terser
			"...",
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						// Lossless optimization with custom option
						// Feel free to experiment with options for better result for you
						plugins: [
							["gifsicle", { interlaced: true }],
							["mozjpeg", { quality: 60 }],
							["optipng", { optimizationLevel: 5 }],
							// Svgo configuration here https://github.com/svg/svgo#configuration
							[
								"svgo",
								{
									name: "preset-default",
									params: {
										overrides: {
											// customize plugin options
											convertShapeToPath: {
												convertArcs: true,
											},
											// disable plugins
											convertPathData: false,
										},
									},
								},
							],
						],
					},
				},
			}),
		],
	},
};
