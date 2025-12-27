import type { PrismaClient } from "../../prisma/generated/prisma/index.js"
import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended"

import { prisma } from "./prismaClient"

jest.mock("./prismaClient", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
