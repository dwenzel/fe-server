/**
 * Jest configuration for API functional tests
 */

module.exports = {
    // Test environment
    testEnvironment: 'node',

    // Test files pattern
    testMatch: ['**/tests/**/*.test.js'],

    // Test timeout - API calls may take longer than default timeout
    testTimeout: 10000,

    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    //collectCoverage: true,
    // The directory where Jest should output its coverage files
    coverageDirectory: '.build/reports/coverage',

    // Collect coverage from these directories
    collectCoverageFrom: [
        'src/**/*.js',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],

    // Coverage reporters
    coverageReporters: ['text', 'lcov', 'clover'],

    //detectOpenHandles: true,
    // Transform files with babel-jest
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },

    // Setup files - run before each test file
    setupFilesAfterEnv: ['./tests/setup.js'],

    // Global variables available in all test files
    globals: {
        API_URL: process.env.API_URL || 'http://localhost:8080',
        API_KEY: process.env.API_KEY || 'test-api-key'
    },

    // Display the detailed output of test results
    verbose: true,

    // Disable automatic mocking
    automock: false,

    // Test reporters
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: './.build/reports/functional/junit',
            outputName: 'junit.xml',
        }],
        ["./node_modules/jest-html-reporter", {
            "pageTitle": "Test Report",
            outputPath: './.build/reports/functional/html/test-report.html',
        }]
    ],

    // Handle ES modules
    extensionsToTreatAsEsm: [],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    // Force Jest to exit after all tests are complete
    //forceExit: true
};
