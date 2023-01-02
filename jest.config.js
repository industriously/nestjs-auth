module.exports = {
  roots: ['<rootDir>'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      { diagnostics: false, tsconfig: '<rootDir>/tsconfig.json' },
    ],
  },
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^lib/(.*)$': '<rootDir>/lib/$1',
    '@interface/(.*)$': '<rootDir>/lib/interface/$1',
  },
  collectCoverageFrom: ['lib/**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['lib/index.ts'],
};
