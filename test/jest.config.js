/** Unit + integration. Run with: bun run test */
module.exports = {
  ...require('./jest.base'),
  testMatch: ['<rootDir>/test/unit/**/*.spec.ts', '<rootDir>/test/integration/**/*.spec.ts'],
  testTimeout: 30_000,
};
