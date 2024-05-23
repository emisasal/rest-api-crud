import { CorsOptions } from "cors"

const allowedOrigins = ["http://localhost:3000"]

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
}
