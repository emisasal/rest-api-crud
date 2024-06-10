import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  errorFormat: "pretty",
})

// Use ONLY this PrismaClient instance!
// Duplicating clients can exhaust the database connection limit.
