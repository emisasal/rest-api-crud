import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // Require DATABASE_URL; Prisma CLI loads .env via dotenv import above
    url: env("DATABASE_URL"),
  },
})
