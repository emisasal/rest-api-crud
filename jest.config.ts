import type { Config } from "@jest/types"
const config: Config.InitialOptions = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/api/config/prismaMock.ts"],
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  moduleDirectories: ["node_modules", "api"],
  // resetMocks: true,
  // restoreMocks: true,
  // moduleNameMapper: pathsToModuleNameMapper({
  //   "config/*": ["config/*"],
  //   "controllers/*": ["controllers/*"],
  //   "middleware/*": ["middleware/*"],
  //   "routes/*": ["routes/*"],
  //   "utils/*": ["utils/*"],
  // }),
}

export default config
