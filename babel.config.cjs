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
  // Add any plugins you might need here
  plugins: []
};