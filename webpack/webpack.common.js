const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { hashElement } = require('folder-hash');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const utils = require('./utils.js');
const environment = require('./environment');

const getTsLoaderRule = () => {
  return [
    {
      loader: 'thread-loader',
      options: {
        // There should be 1 cpu for the fork-ts-checker-webpack-plugin.
        // The value may need to be adjusted (e.g. to 1) in some CI environments,
        // as cpus() may report more cores than what are available to the build.
        workers: require('os').cpus().length - 1,
      },
    },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        happyPackMode: true,
      },
    },
  ];
};

module.exports = async options => {
  const development = options.env === 'development';
  const languagesHash = await hashElement(path.resolve(__dirname, '../client/i18n'), {
    algo: 'md5',
    encoding: 'hex',
    files: { include: ['*.json'] },
  });

  return merge(
    {
      cache: {
        // 1. Set cache type to filesystem
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '../target/webpack'),
        buildDependencies: {
          // 2. Add your config as buildDependency to get cache invalidation on config change
          config: [
            __filename,
            path.resolve(__dirname, `webpack.${development ? 'dev' : 'prod'}.js`),
            path.resolve(__dirname, 'environment.js'),
            path.resolve(__dirname, 'utils.js'),
            path.resolve(__dirname, '../postcss.config.js'),
            path.resolve(__dirname, '../tsconfig.json'),
          ],
        },
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        modules: ['node_modules'],
        alias: utils.mapTypescriptAliasToWebpackAlias(),
        fallback: {
          path: require.resolve('path-browserify'),
        },
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: getTsLoaderRule(options.env),
            include: [utils.root('./client/app')],
            exclude: [utils.root('node_modules')],
          },
          /*
       ,
       Disabled due to https://github.com/jhipster/generator-jhipster/issues/16116
       Can be enabled with @reduxjs/toolkit@>1.6.1
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'source-map-loader'
      }
      */
        ],
      },
      stats: {
        children: false,
      },
      plugins: [
        new webpack.EnvironmentPlugin({
          // react-jhipster requires LOG_LEVEL config.
          LOG_LEVEL: development ? 'info' : 'error',
        }),
        new webpack.DefinePlugin({
          I18N_HASH: JSON.stringify(languagesHash.hash),
          DEVELOPMENT: JSON.stringify(development),
          VERSION: JSON.stringify(environment.VERSION),
          SERVER_API_URL: JSON.stringify(environment.SERVER_API_URL),
        }),
        new ESLintPlugin({
          configType: 'flat',
          extensions: ['ts', 'tsx'],
        }),
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin({
          patterns: [
            {
              // https://github.com/swagger-api/swagger-ui/blob/v4.6.1/swagger-ui-dist-package/README.md
              context: require('swagger-ui-dist').getAbsoluteFSPath(),
              from: '*.{js,css,html,png}',
              to: 'swagger-ui/',
              globOptions: { ignore: ['**/index.html'] },
            },
            {
              from: path.join(path.dirname(require.resolve('axios/package.json')), 'dist/axios.min.js'),
              to: 'swagger-ui/',
            },
            { from: './client/swagger-ui/', to: 'swagger-ui/' },
            // Content folder may be absent; don't fail the build if missing
            { from: './client/app/content/', to: 'content/', noErrorOnMissing: true },
            { from: './client/favicon.ico', to: 'favicon.ico' },
            { from: './client/manifest.webapp', to: 'manifest.webapp' },
            // jhipster-needle-add-assets-to-webpack - JHipster will add/remove third-party resources in this array
            { from: './client/robots.txt', to: 'robots.txt' },
          ],
        }),
        new HtmlWebpackPlugin({
          template: './client/index.html',
          chunksSortMode: 'auto',
          inject: 'body',
          base: '/',
        }),
        new MergeJsonWebpackPlugin({
          output: {
            groupBy: [
              { pattern: './client/i18n/en/*.json', fileName: './i18n/en.json' },
              { pattern: './client/i18n/al/*.json', fileName: './i18n/al.json' },
              { pattern: './client/i18n/ar-ly/*.json', fileName: './i18n/ar-ly.json' },
              { pattern: './client/i18n/hy/*.json', fileName: './i18n/hy.json' },
              { pattern: './client/i18n/az-Latn-az/*.json', fileName: './i18n/az-Latn-az.json' },
              { pattern: './client/i18n/by/*.json', fileName: './i18n/by.json' },
              { pattern: './client/i18n/bn/*.json', fileName: './i18n/bn.json' },
              { pattern: './client/i18n/bg/*.json', fileName: './i18n/bg.json' },
              { pattern: './client/i18n/ca/*.json', fileName: './i18n/ca.json' },
              { pattern: './client/i18n/zh-cn/*.json', fileName: './i18n/zh-cn.json' },
              { pattern: './client/i18n/zh-tw/*.json', fileName: './i18n/zh-tw.json' },
              { pattern: './client/i18n/hr/*.json', fileName: './i18n/hr.json' },
              { pattern: './client/i18n/cs/*.json', fileName: './i18n/cs.json' },
              { pattern: './client/i18n/da/*.json', fileName: './i18n/da.json' },
              { pattern: './client/i18n/nl/*.json', fileName: './i18n/nl.json' },
              { pattern: './client/i18n/et/*.json', fileName: './i18n/et.json' },
              { pattern: './client/i18n/fa/*.json', fileName: './i18n/fa.json' },
              { pattern: './client/i18n/fi/*.json', fileName: './i18n/fi.json' },
              { pattern: './client/i18n/fr/*.json', fileName: './i18n/fr.json' },
              { pattern: './client/i18n/gl/*.json', fileName: './i18n/gl.json' },
              { pattern: './client/i18n/de/*.json', fileName: './i18n/de.json' },
              { pattern: './client/i18n/el/*.json', fileName: './i18n/el.json' },
              { pattern: './client/i18n/he/*.json', fileName: './i18n/he.json' },
              { pattern: './client/i18n/hi/*.json', fileName: './i18n/hi.json' },
              { pattern: './client/i18n/hu/*.json', fileName: './i18n/hu.json' },
              { pattern: './client/i18n/id/*.json', fileName: './i18n/id.json' },
              { pattern: './client/i18n/it/*.json', fileName: './i18n/it.json' },
              { pattern: './client/i18n/ja/*.json', fileName: './i18n/ja.json' },
              { pattern: './client/i18n/ko/*.json', fileName: './i18n/ko.json' },
              { pattern: './client/i18n/mr/*.json', fileName: './i18n/mr.json' },
              { pattern: './client/i18n/my/*.json', fileName: './i18n/my.json' },
              { pattern: './client/i18n/pl/*.json', fileName: './i18n/pl.json' },
              { pattern: './client/i18n/pt-br/*.json', fileName: './i18n/pt-br.json' },
              { pattern: './client/i18n/pt-pt/*.json', fileName: './i18n/pt-pt.json' },
              { pattern: './client/i18n/pa/*.json', fileName: './i18n/pa.json' },
              { pattern: './client/i18n/ro/*.json', fileName: './i18n/ro.json' },
              { pattern: './client/i18n/ru/*.json', fileName: './i18n/ru.json' },
              { pattern: './client/i18n/sk/*.json', fileName: './i18n/sk.json' },
              { pattern: './client/i18n/sr/*.json', fileName: './i18n/sr.json' },
              { pattern: './client/i18n/si/*.json', fileName: './i18n/si.json' },
              { pattern: './client/i18n/es/*.json', fileName: './i18n/es.json' },
              { pattern: './client/i18n/sv/*.json', fileName: './i18n/sv.json' },
              { pattern: './client/i18n/tr/*.json', fileName: './i18n/tr.json' },
              { pattern: './client/i18n/ta/*.json', fileName: './i18n/ta.json' },
              { pattern: './client/i18n/te/*.json', fileName: './i18n/te.json' },
              { pattern: './client/i18n/th/*.json', fileName: './i18n/th.json' },
              { pattern: './client/i18n/ua/*.json', fileName: './i18n/ua.json' },
              { pattern: './client/i18n/uz-Cyrl-uz/*.json', fileName: './i18n/uz-Cyrl-uz.json' },
              { pattern: './client/i18n/uz-Latn-uz/*.json', fileName: './i18n/uz-Latn-uz.json' },
              { pattern: './client/i18n/vi/*.json', fileName: './i18n/vi.json' },
              { pattern: './client/i18n/kr-Latn-kr/*.json', fileName: './i18n/kr-Latn-kr.json' },
              // jhipster-needle-i18n-language-webpack - JHipster will add/remove languages in this array
            ],
          },
        }),
      ],
    },
    // jhipster-needle-add-webpack-config - JHipster will add custom config
  );
};
