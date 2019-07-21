var path = require('path');

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'app'),
  },
  mode: "development",
  resolve: {
    alias: {  // Allows absolute paths in import statements 
      '@avo': path.resolve(__dirname, 'src/avo/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
}
