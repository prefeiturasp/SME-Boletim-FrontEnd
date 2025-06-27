export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["/node_modules/"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/interfaces/**",
    "!src/pages/**",
    "!src/redux/**",
    "!src/types/**",
    "!src/App.tsx",
    "!src/main.tsx",
    "!src/servicos.tsx",
    "!src/vite-env.d.ts",
    "!src/__mocks__/**",
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
};
