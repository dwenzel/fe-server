/**
 * Babel configuration for Jest tests
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  // Add any plugins you might need here
  plugins: [],
};