process.env.NODE_ENV = 'development';

var webpack = require("webpack");
var gutil = require("gutil");
var path = require("path");
var combineLoaders = require("webpack-combine-loaders");

var compiler = webpack({
  cache: true,
  devtool: "source-map",
  entry: path.resolve(__dirname, "src/client/index.jsx"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: 'index.js'
  },
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      loader: 'babel',
      include: path.resolve(__dirname, "src/client"),
      query: {
        presets: ['es2015', 'react'],
        compact: false,
        cacheDirectory: true
      }
    },
    {
      test: /\.css$/,
      loader: combineLoaders([
        {
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          query: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }
      ])
    },
    {
      test: /\.png$/,
      loader: "url-loader?limit=100000"
    },
    {
      test: /\.jpg$/,
      loader: "file-loader"
    }],
    plugins: [
      new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      })
    ]
  }
});

compiler.watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    poll: true // use polling instead of native watchers
}, function(err, stats) {
  if (err) {
    console.error(err);
  }
  gutil.log('[webpack:build]', stats.toString({
              chunks: false, // Makes the build much quieter
              colors: true
  }));
});
