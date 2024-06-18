import express from "express"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { corsOptions } from "./config/corsOptions"
import customerSessionRoutes from "./routes/customerSession.routes"
import routes from "./routes"
import globalErrorHandler from "./middleware/errorHandler.middleware"
import notFoundHandler from "./middleware/notFound.middleware"
import verifyJWT from "./middleware/verifyJWT"

const { PORT, NODE_ENV, COOKIE_SECRET } = process.env

const app = express()

app.use(cors(corsOptions))
app.use(morgan(NODE_ENV === "development" ? "dev" : "common"))
app.use(cookieParser(COOKIE_SECRET))
app.use(express.json()) // recognize body as json
app.use(express.urlencoded({ extended: false })) // recognize body as string or array

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
