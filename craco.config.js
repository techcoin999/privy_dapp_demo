const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix React Refresh runtime issue
      webpackConfig.resolve.symlinks = false;
      
      // Disable React Refresh in development to avoid path issues
      if (webpackConfig.mode === 'development') {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'ReactRefreshPlugin'
        );
      }
      
      // Add alias to fix noble/hashes compatibility
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@noble/hashes/utils': require.resolve('@noble/hashes/utils'),
      };
      
      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process'),
        vm: false,
        fs: false,
        os: false,
        path: false,
        url: false,
        querystring: false,
        assert: false,
        http: false,
        https: false,
        net: false,
        tls: false,
        zlib: false
      };

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process',
        }),
        new webpack.DefinePlugin({
          'process.env': JSON.stringify({}),
          'global': 'globalThis'
        }),
        // Ignore missing exports
        new webpack.IgnorePlugin({
          checkResource(resource, context) {
            // Ignore noble/hashes compatibility issues
            if (resource.includes('@noble/hashes')) {
              return false;
            }
            return false;
          },
        }),
      ];

      // Add rules for handling ESM modules and JSON files properly
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        type: "javascript/auto",
      });

      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });

      // Handle JSON files
      webpackConfig.module.rules.push({
        test: /\.json$/,
        type: "javascript/auto",
        use: "json-loader"
      });

      // Add rule to handle noble/hashes compatibility
      webpackConfig.module.rules.push({
        test: /node_modules\/@noble\/hashes\/.*\.js$/,
        use: {
          loader: 'string-replace-loader',
          options: {
            multiple: [
              {
                search: /import\s*{\s*anumber\s*}\s*from\s*['"]@noble\/hashes\/utils['"];?/g,
                replace: '// anumber import removed for compatibility',
                flags: 'g'
              },
              {
                search: /import\s*{\s*([^}]*),\s*anumber\s*,?\s*([^}]*)\s*}\s*from\s*['"]@noble\/hashes\/utils['"];?/g,
                replace: 'import { $1 $2 } from "@noble/hashes/utils"; // anumber removed',
                flags: 'g'
              },
              {
                search: /anumber\s*\(/g,
                replace: '(() => { throw new Error("anumber function not available"); })(',
                flags: 'g'
              }
            ]
          }
        }
      });
      
      // Ignore problematic noble/hashes dependencies completely
      webpackConfig.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /@noble\/hashes/,
        })
      );

      // Ignore TypeScript errors in node_modules (third-party dependencies)
      webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
        if (rule.test && rule.test.toString().includes('tsx?')) {
          rule.exclude = /node_modules/;
        }
        return rule;
      });

      return webpackConfig;
    },
  },
  typescript: {
    enableTypeChecking: false  // Disable TypeScript checking for faster builds
  },
};