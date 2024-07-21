import type { CorsOptions } from "cors"

const allowedOrigins = ["http://localhost:3000"]

export const corsOptions: CorsOptions = {
  credentials: true, // allows cookies
  origin: allowedOrigins,
}
