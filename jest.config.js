export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    // "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
    // "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
    // ✅ só ts-jest para TS/TSX, apontando para o tsconfig de testes
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
    // ✅ babel-jest apenas para JS/JSX
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js",    
    "^.+[\\\\/]servicos(?:\\.tsx?)?$": "<rootDir>/src/__mocks__/servicos.tsx",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(antd|@babel|rc-util|rc-pagination|rc-picker|rc-table|rc-tree|rc-select)/)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/interfaces/**",
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
