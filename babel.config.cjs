/**
 * Babel configuration for Jest tests and ES modules
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'auto'
      },
    ],
  ],
  // Plugins for test features
  plugins: [
    // Add support for import.meta.url in tests
    '@babel/plugin-syntax-import-meta'
  ],
  // Support ESM features
  assumptions: {
    superIsCallableConstructor: false,
  }
};