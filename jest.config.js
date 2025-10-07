export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.app.json"  // 👈 usa o app.json que tem JSX/esModuleInterop
      }
    ],
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(antd|@ant-design|rc-.+?)/)"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js"
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"]
};
