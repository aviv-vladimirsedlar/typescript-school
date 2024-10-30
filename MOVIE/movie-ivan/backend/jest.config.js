/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });


module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  collectCoverage: true,

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Define the files to collect coverage from
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    '!src/**/index.ts', // Exclude index files if desired
    '!src/config/swagger.ts', // Exclude swagger file
    '!src/plugins/winston-logger.plugin.ts', // Exclude logger file
  ],
  coverageDirectory: 'coverage', // Output directory for coverage reports
  coverageReporters: ['text', 'lcov'], // Specify the format(s) for coverage reports
  coverageThreshold: {
    global: {
      statements: 100, // Require 80% of statements to be covered
      branches: 100, // Require 75% of branches to be covered
      functions: 100, // Require 80% of functions to be covered
      lines: 100, // Require 80% of lines to be covered
    },
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true, // Move settings here
      },
    ],
  },
};
