const nodePolyfill = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      fs:false,
      child_process: false,
      tls: false,
      net: false,
    },
  },
  plugins: [
    new nodePolyfill(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  node: {global: true}
};
