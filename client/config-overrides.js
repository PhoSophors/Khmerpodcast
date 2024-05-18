const { override, addWebpackPlugin } = require('customize-cra');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = override(
  addWebpackPlugin(
    new JavaScriptObfuscator({
      rotateUnicodeArray: true
    }, [])
  )
);