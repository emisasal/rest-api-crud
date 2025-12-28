import "dotenv/config"
import { PrismaClient } from "../../prisma/generated/prisma/index.js"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })

export const prisma = new PrismaClient({
	errorFormat: "pretty",
	log: ["info", "warn", "error"],
	adapter,
})

// Use ONLY this PrismaClient instance!
// Duplicating clients can exhaust the database connection limit.
