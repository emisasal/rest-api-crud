import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

// Use ONLY this PrismaClient instance!
// Duplicating clients can exhaust the database connection limit.
