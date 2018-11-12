'use strict';

const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options) => {
  // see docs about api at https://babeljs.io/docs/en/config-files#apicache
  api.assertVersion(7);

  const {
    modules,
    targets,
    removePropTypes,
  } = options;

  if (typeof modules !== 'undefined' && typeof modules !== 'boolean' && modules !== 'auto') {
    throw new TypeError('@txo/babel-preset only accepts `true`, `false`, or `"auto"` as the value of the "modules" option');
  }

  const debug = typeof options.debug === 'boolean' ? options.debug : false;
  const development = typeof options.development === 'boolean'
    ? options.development
    : api.cache.using(() => process.env.NODE_ENV === 'development');

  return {
    presets: [
      [require('@babel/preset-env'), {
        debug,
        exclude: [
          'transform-async-to-generator',
          'transform-template-literals',
          'transform-regenerator',
        ],
        modules: modules === false ? false : 'auto',
        targets,
      }],
      [require('@babel/preset-react'), { development }],
      require('@babel/preset-flow'),
    ],
    plugins: [
      [require('@babel/plugin-transform-template-literals'), {
        spec: true,
      }],
      require('@babel/plugin-transform-jscript'),
      [require('@babel/plugin-proposal-object-rest-spread'), {
        useBuiltIns: true,
      }],
      require('babel-plugin-syntax-trailing-function-commas'),
	  // Stage 0
      require('@babel/plugin-proposal-function-bind'),
	  // Stage 1
      require('@babel/plugin-proposal-export-default-from'),
      require('@babel/plugin-proposal-logical-assignment-operators'),
      [require('@babel/plugin-proposal-optional-chaining'), { "loose": false }],
      [require('@babel/plugin-proposal-pipeline-operator'), { "proposal": "minimal" }],
      [require('@babel/plugin-proposal-nullish-coalescing-operator'), { "loose": false }],
      // require('@babel/plugin-proposal-do-expressions'),
	  // Stage 2
      [require('@babel/plugin-proposal-decorators'), { "legacy": true }],
      require('@babel/plugin-proposal-function-sent'),
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-proposal-throw-expressions'),
      // Stage 3
      require('@babel/plugin-syntax-dynamic-import'),
      // require('@babel/plugin-syntax-import-meta'),
      [require('@babel/plugin-proposal-class-properties'), { "loose": false }],
      // require('@babel/plugin-proposal-json-strings')
    ].filter(Boolean),
  };
});
