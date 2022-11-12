export default {
	roots: ['<rootDir>/src'],
	collectCoverage: true,
	collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
	clearMocks: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'node',
	transform: {
		'.+\\.ts': 'ts-jest',
	},
	preset: '@shelf/jest-mongodb',
};
