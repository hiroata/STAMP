module.exports = {
    testEnvironment: 'jsdom',
    collectCoverageFrom: ['js/**/*.js', '!js/**/*.test.js', '!**/node_modules/**'],
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text', 'lcov'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    moduleFileExtensions: ['js', 'json'],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    globals: {
        firebase: {},
        firebaseDatabase: {},
        firebaseAuth: {},
        firebaseStorage: {}
    }
};
