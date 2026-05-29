/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  extensionsToTreatAsEsm: [".ts"],

  testMatch: ["**/*.test.ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],

  clearMocks: true,
  restoreMocks: true,
};
