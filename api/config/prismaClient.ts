import { PrismaClient } from "../../prisma/generated/prisma"

export const prisma = new PrismaClient({
	errorFormat: "pretty",
	log: ["info", "warn", "error"],
})

// Use ONLY this PrismaClient instance!
// Duplicating clients can exhaust the database connection limit.
