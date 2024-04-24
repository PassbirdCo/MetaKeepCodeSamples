module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "/__tests__/.*\\.(test|spec)\\.[jt]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js)$": "babel-jest",
  },
  transformIgnorePatterns: [],
};
