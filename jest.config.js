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
    '@LIB/(.*)$': '<rootDir>/lib/$1',
    '@COMMON$': '<rootDir>/lib/common',
    '@UTILS$': '<rootDir>/lib/utils',
  },
  collectCoverageFrom: ['lib/**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['lib/index.ts'],
};
