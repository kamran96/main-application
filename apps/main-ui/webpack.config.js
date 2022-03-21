const getWebpackConfig = require('@nrwl/react/plugins/webpack');
const webpack = require('webpack');

const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
function getCustomWebpackConfig(webpackConfig) {
  const config = getWebpackConfig(webpackConfig);
  // config?.resolve?.plugins.push(new AntdDayjsWebpackPlugin());
  config.resolve = {
    ...config.resolve,
    fallback: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      buffer: require.resolve('buffer'),
      asset: require.resolve('assert'),
      process: require.resolve('process/browser'),
    },
  };
  config.node = undefined;

  config.plugins.push(new AntdDayjsWebpackPlugin());
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    })
  );

  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[name][ext][query]',
    },
  });

  console.log(config.module.rules, 'webpack config');

  return config;
}

module.exports = getCustomWebpackConfig;
