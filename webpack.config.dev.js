const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");

module.exports = {
    mode: "development",
    entry: [
        "./src/index.js" // your app's entry point
    ],
    //devtool: "source-map",
    devtool: process.env.WEBPACK_DEVTOOL || "eval-source-map",
    output: {
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: require.resolve("babel-loader"),
                options: {
                    // rootMode: "upward",
                    // This is a feature of `babel-loader` for Webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                modules: false,
                                targets: {
                                    node: "current"
                                }
                            }
                        ],
                        ["@babel/preset-react"]
                    ],
                    plugins: [
                        [
                            "@babel/plugin-proposal-decorators",
                            {
                                legacy: true
                            }
                        ],
                        ["@babel/plugin-syntax-class-properties"],
                        [
                            "@babel/plugin-proposal-class-properties",
                            {
                                loose: true
                            }
                        ],
                        "@babel/plugin-transform-runtime",
                        "add-react-displayname",
                        ["react-hot-loader/babel"]
                    ]
                }
            },
            // =========
            // = Fonts =
            // =========
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: ["file-loader"]
            },
            {
                test: /\.(woff|woff2)$/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: [
                    {
                        loader: "url-loader",
                        options: { prefix: "font", limit: 5000 }
                    }
                ]
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            prefix: "font",
                            limit: 10000,
                            mimetype: "application/octet-stream"
                        }
                    }
                ]
            },
            // ==========
            // = Images =
            // ==========
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            mimetype: "image/svg+xml"
                        }
                    }
                ]
            },
            {
                test: /\.gif/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            mimetype: "image/gif"
                        }
                    }
                ]
            },
            {
                test: /\.jpg/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            mimetype: "image/jpg"
                        }
                    }
                ]
            },
            {
                test: /\.png/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            mimetype: "image/png",
                            name: "[path][name].[ext]"
                        }
                    }
                ]
            },
            // ==========
            // = Styles =
            // ==========
            // Global CSS (from node_modules)
            // ==============================
            {
                test: /\.css/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: true, //process.env.NODE_ENV !== "development",
                            hmr: true
                        }
                    },
                    "css-loader"
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: true, //process.env.NODE_ENV !== "development",
                            hmr: true
                        }
                    },
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [
            "node_modules" // the old 'fallback' option (needed for npm link-ed packages)
        ],
        symlinks: true,
        alias: {
            // components: path.resolve(__dirname, "views/Components")
        }
    },
    devServer: {
        contentBase: resolve("public"),
        noInfo: true,
        open: true,
        compress: true,
        hot: true,
        historyApiFallback: true,
        port: 3000,
        writeToDisk: true
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "style.css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({ template: resolve("public", "index.html") })
    ]
};
