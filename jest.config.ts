/** @type {import('ts-jest').JestConfigWithTsJest} */
// /** @type {import('ts-jest').pathsToModuleNameMapper} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  modulePaths: ["api"],
  // moduleNameMapper: pathsToModuleNameMapper({
  //   "config/*": ["config/*"],
  //   "controllers/*": ["controllers/*"],
  //   "middleware/*": ["middleware/*"],
  //   "routes/*": ["routes/*"],
  //   "utils/*": ["utils/*"],
  // }),
}
