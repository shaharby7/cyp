const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  bail: 0,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/src/types/", "/src/test/"],
  coverageProvider: "v8",
  moduleDirectories: ["node_modules"],
  testMatch: [`**/src/**/*.test.ts`],
  testTimeout: 0,
};

module.exports = config;
