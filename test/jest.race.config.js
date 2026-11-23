/** Race/property tests. Serial files so concurrency inside a test is the only concurrency. */
module.exports = {
  ...require('./jest.base'),
  testMatch: ['<rootDir>/test/race/**/*.spec.ts'],
  maxWorkers: 1,
  testTimeout: 180_000,
  passWithNoTests: true,
};
