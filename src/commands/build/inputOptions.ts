const rollupPluginBabel = require('rollup-plugin-babel');
const less = require('rollup-plugin-less');
const sass = require('rollup-plugin-sass');
const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginCommonjs = require('rollup-plugin-commonjs');

export default {
  input: 'src/app.js',
  plugins: [
    rollupPluginBabel({
      plugins: [
        require('@babel/plugin-proposal-class-properties'),
        [
          require('@babel/plugin-transform-react-jsx'),
          {
            pragma: 'h'
          }
        ]
      ],
      presets: [
        [
          require('@babel/preset-env'),
          {
            targets: {
              node: 6
            }
          }
        ]
      ]
    }),
    less({
      // less 不需要输出到文件
      output: () => ''
    }),
    sass(),
    rollupPluginNodeResolve({
      module: false,
      extensions: ['.js']
    }),
    rollupPluginCommonjs({
      namedExports: {
        'node_modules/@rematch/core/dist/cjs/index.js': ['init'],
        'node_modules/apollo-link-http/lib/bundle.umd.js': ['HttpLink']
      }
    })
  ]
};
