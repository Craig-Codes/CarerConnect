export default {
  extensionsToTreatAsEsm: [".ts", ".tsx"], // Treat TypeScript files as ES modules
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true, // Enable ESM in ts-jest
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Path to setup file
  testPathIgnorePatterns: [
    "/e2e/", // Ignore the e2e folder
  ],
};
