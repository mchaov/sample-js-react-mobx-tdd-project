"use strict";
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    // devtool: "cheap-module-source-map",
    // devtool: "source-map",
    entry: [
        "./src/index.js" // your app's entry point
    ],
    output: {
        publicPath: "./",
        path: path.join(__dirname, "dist"),
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
                        ["transform-remove-console"]
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
                            sourceMap: true,
                            hmr: false
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
                            sourceMap: true,
                            hmr: false
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
            components: path.resolve(__dirname, "views/Components")
        }
    },
    optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: "~",
            name: true
        },
        minimize: true,
        minimizer: [
            // This is only used in production mode
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2
                    },
                    mangle: {
                        safari10: true
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true
                    }
                },
                cache: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"production"'
            }
        }),
        new MiniCssExtractPlugin({
            sourceMap: true,
            filename: "style.css",
            chunkFilename: "[id].css"
        }),
        new CompressionPlugin({
            algorithm: "gzip"
        }),
        new CopyPlugin([
            { from: "public/manifest.json", to: "./" },
            { from: "public/favicon.png", to: "./" },
            { from: "public/favicon.svg", to: "./" }
        ]),
        new HtmlWebpackPlugin({
            template: resolve("public", "index.html"),
            filename: "index.html",
            files: {
                css: ["style.css"],
                js: ["bundle.js"]
            }
        })
        // ,new BundleAnalyzerPlugin()
        // new webpack.SourceMapDevToolPlugin({})
    ]
};
