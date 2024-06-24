import express from "express"
import session from "express-session"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import RedisStore from "connect-redis"
import swaggerUi from "swagger-ui-express"
import { corsOptions } from "./config/corsOptions"
import customerSessionRoutes from "./routes/customerSession.routes"
import routes from "./routes"
import globalErrorHandler from "./middleware/errorHandler.middleware"
import notFoundHandler from "./middleware/notFound.middleware"
import verifyJWT from "./middleware/verifyJWT"
import swaggerSpec from "../swagger/swaggerSpec"
import redis from "config/redisClient"

const { PORT, NODE_ENV, SESSION_SECRET, COOKIE_SECRET } = process.env

const app = express()

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json()) // recognize body as json
app.use(express.urlencoded({ extended: true })) // recognize body as string or array
app.use(cookieParser(COOKIE_SECRET))
app.use(morgan(NODE_ENV === "development" ? "dev" : "common"))

app.use(
  session({
    store: new RedisStore({ client: redis, prefix: "session" }),
    name: "refresh_token",
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // },
  })
)

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
)

// Session routes
app.use("/api", customerSessionRoutes)
app.use(verifyJWT as any)
// Registered routes
app.use("/api", routes)

// Not Found middleware
app.use(notFoundHandler)
// Error middleware
app.use(globalErrorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Enviroment: ${NODE_ENV}`)
  console.log(`Server running on port: ${PORT}`)
})
