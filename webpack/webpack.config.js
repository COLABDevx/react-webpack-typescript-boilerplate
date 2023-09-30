const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const buildPath = path.join(__dirname, '../build');
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV == "development"
const assetsPath = 'assets'

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: isDev ? assetsPath + '/js/[name].bundle.js' : assetsPath + '/js/[name].[hash].js',
    path: buildPath,
    publicPath: "/",
    chunkFilename: '[name].chunk.[chunkhash].js'
  },
  experiments: {
    topLevelAwait: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        appVendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    // runtimeChunk: {
    //   name: (entrypoint) => `runtime~${entrypoint.name}`,
    // },
    minimize: !isDev,
    minimizer: [new TerserPlugin()],
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,

          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: assetsPath + '/images/[name].[hash].[ext]',
              publicPath: './'
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
              name: assetsPath + '/images/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.ttf$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: assetsPath + '/fonts/[name].[hash].[ext]',
            emitFile: false,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: './static/index.html',
      filename: './index.html',
      inject: false,
      publicPath: "./",
      favicon: "./static/favicon.ico"
    }),
    new MiniCssExtractPlugin({
      filename: assetsPath + '/css/[name].[hash].css',

    }),
    new webpack.DefinePlugin({
      __REACT_DEVTOOLS_GLOBAL_HOOK__: `({ isDisabled: true })`,
    }),
  ],
  devServer: {
    historyApiFallback: { index: "/", disableDotRule: true },
    open: true,
    devMiddleware: {
      writeToDisk: true
    }
  },
  
};
