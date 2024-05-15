const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // ... existing configuration ...
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          format: {
            comments: false,
          },
          mangle: true, // Ensure you know how this affects your code
        },
        extractComments: false,
      }),
    ],
  },
  // ... remaining configuration ...
};
