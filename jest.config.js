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

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // Collect coverage from these directories
    collectCoverageFrom: [
        'dist/**/*.js',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],

    // Coverage reporters
    coverageReporters: ['text', 'lcov', 'clover'],

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

    // Retry failed tests - useful for API tests that might occasionally fail
    retry: 2,

    // Test reporters
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: './.build/reports/junit',
            outputName: 'junit.xml',
        }],
        ["./node_modules/jest-html-reporter", {
            outputPath: './.build/reports/html/report.html',
            includeFailureMsg: true,
            "pageTitle": "Test Report"
        }]
    ],

    // Force Jest to exit after all tests are complete
    forceExit: true
};
