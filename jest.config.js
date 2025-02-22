export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["./src/__tests__/utils/setup.js"],
  testMatch: [
    "**/__tests__/integration/**/*.test.js",
    "**/__tests__/unit/**/*.test.js",
  ],
};
