/**
 * Jest configuration for all tests
 */

const baseConfig = {
  // Common test configuration
  testEnvironment: 'node',
  clearMocks: true,
  setupFilesAfterEnv: ['./tests/setup.js'],
  automock: false,
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  globals: {
    API_URL: process.env.API_URL || 'http://localhost:8080',
    API_KEY: process.env.API_KEY || 'test-api-key'
  },
  // Handle ES modules
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // Coverage configuration
  coverageDirectory: '.build/reports/coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**'
  ]
};

// Configuration specific to test type
const testConfigs = {
  unit: {
    displayName: 'Unit Tests',
    testMatch: ['**/tests/unit/**/*.test.js'],
    setupFilesAfterEnv: ['./tests/unit/setup.js', './tests/setup.js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!**/node_modules/**'
    ],
    coverageDirectory: '.build/reports/coverage/unit'
  },
  functional: {
    displayName: 'Functional Tests',
    testMatch: ['**/tests/functional/**/*.test.js'],
    setupFilesAfterEnv: ['./tests/functional/setup.js', './tests/setup.js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!**/node_modules/**'
    ],
    coverageDirectory: '.build/reports/coverage/functional'
  }
};

// Determine which tests to run based on the test environment variable
// If no TEST_TYPE is specified, run all tests
const testType = process.env.TEST_TYPE;
let projects = [];

if (!testType || testType === 'all') {
  // Run all test types
  projects = [
    { ...baseConfig, ...testConfigs.unit },
    { ...baseConfig, ...testConfigs.functional }
  ];
} else if (testType === 'unit') {
  // Run only unit tests
  projects = [{ ...baseConfig, ...testConfigs.unit }];
} else if (testType === 'functional') {
  // Run only functional tests
  projects = [{ ...baseConfig, ...testConfigs.functional }];
} else {
  // Default to all tests if an invalid type is specified
  console.warn(`Warning: Unknown test type "${testType}". Running all tests.`);
  projects = [
    { ...baseConfig, ...testConfigs.unit },
    { ...baseConfig, ...testConfigs.functional }
  ];
}

// Configure reporters at the global level
const junitReporterConfig = {
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './.build/reports/junit',
      outputName: process.env.TEST_TYPE === 'unit' ? 'unit.xml' :
                  process.env.TEST_TYPE === 'functional' ? 'functional.xml' :
                  'all.xml',
      includeConsoleOutput: true,
      classNameTemplate: '{classname}',
      titleTemplate: '{title}'
    }]
  ]
};

// Add HTML reporter if available
try {
  require.resolve('jest-html-reporter');
  junitReporterConfig.reporters.push(
    ['jest-html-reporter', {
      outputPath: process.env.TEST_TYPE === 'unit' ?
                  './.build/reports/html/unit-test-report.html' :
                  process.env.TEST_TYPE === 'functional' ?
                  './.build/reports/html/functional-test-report.html' :
                  './.build/reports/html/all-test-report.html',
      pageTitle: process.env.TEST_TYPE === 'unit' ?
                'Unit Test Report' :
                process.env.TEST_TYPE === 'functional' ?
                'Functional Test Report' :
                'Combined Test Report',
      includeFailureMsg: true,
      includeSuiteFailure: true
    }]
  );
} catch (e) {
  console.log('jest-html-reporter not available, skipping HTML reports');
}

// Create directory for reports
const fs = require('fs');
const dirs = [
  './.build',
  './.build/reports',
  './.build/reports/junit',
  './.build/reports/html',
];

dirs.forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.warn(`Could not create directory: ${dir}`, err);
  }
});

module.exports = {
  // Use Jest's projects feature to run different types of tests
  projects,

  // If projects is empty (which shouldn't happen given our logic above), run with base config
  ...(!projects.length ? baseConfig : {}),

  // Apply reporters configuration
  ...junitReporterConfig,

  // Give a useful name to the test suite
  displayName: {
    name: 'Pages & Items API',
    color: 'blue'
  }
};
