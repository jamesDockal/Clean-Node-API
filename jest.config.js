module.exports = {
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  collectCoverage: false,
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  coverageProvider: 'babel',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
