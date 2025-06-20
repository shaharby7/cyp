/** @type {import('ts-jest').JestConfigWithTsJest} */

// eslint-disable-next-line no-undef
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    globalSetup: "./src/test/register",
    bail: 0,
    cacheDirectory: "/tmp/jest_rs",
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: ["/node_modules/", "/src/types/", "/src/test/"],
    coverageProvider: "v8",
    moduleDirectories: ["node_modules"],
    testMatch: [`**/src/test/**/*.test.ts`],
    testTimeout: 0,
};