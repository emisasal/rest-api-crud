import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // Use process.env to avoid hard failures on commands that don't need DB
    url: process.env.DATABASE_URL ?? "",
  },
})
