import "@testing-library/jest-dom";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};


global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

process.env.VITE_API_URL = "http://localhost:3000";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;

beforeAll(() => {
  Object.defineProperty(global, "import", {
    value: {
      meta: {
        env: {
          VITE_SERAP_URL: "/",
        },
      },
    },
    writable: true,
  });
});
