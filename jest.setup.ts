import "@testing-library/jest-dom";

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));
