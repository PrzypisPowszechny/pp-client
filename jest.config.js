module.exports = {
  "roots": [
    "<rootDir>/src",
    "<rootDir>/e2e",
    "<rootDir>/validate-annotations",
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "moduleDirectories": [
    "node_modules",
    "src"
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.js"
  },
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.test.json"
    }
  },
}
