import type { Config } from "@jest/types"
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  clearMocks: true,
  // resetMocks: true,
  // restoreMocks: true,
  modulePaths: ["api"],
  setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
  // moduleNameMapper: pathsToModuleNameMapper({
  //   "config/*": ["config/*"],
  //   "controllers/*": ["controllers/*"],
  //   "middleware/*": ["middleware/*"],
  //   "routes/*": ["routes/*"],
  //   "utils/*": ["utils/*"],
  // }),
}

export default config
