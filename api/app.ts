import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express"
import { corsOptions } from "./config/corsOptions"
import customerSessionRoutes from "./routes/customerSession.routes"
import routes from "./routes"
import globalErrorHandler from "./middleware/errorHandler.middleware"
import notFoundHandler from "./middleware/notFound.middleware"
import verifyJWT from "./middleware/verifyJWT"
import swaggerSpec from "./docs/swaggerSpec"

const { NODE_ENV, COOKIE_SECRET } = process.env

const app = express()

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json()) // recognize body as json
app.use(express.urlencoded({ extended: true })) // recognize body as string or array
app.use(cookieParser(COOKIE_SECRET))
app.use(morgan(NODE_ENV === "development" ? "dev" : "common"))

// Swagger
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
)

// Session routes
app.use("/api", customerSessionRoutes)
// Access JWT verification
app.use(verifyJWT)
// Registered routes
app.use("/api", routes)


// Not Found middleware
app.use(notFoundHandler)
// Error middleware
app.use(globalErrorHandler)

export default app
