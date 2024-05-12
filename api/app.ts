import express from "express"
import cors from "cors"
import morgan from "morgan"
import routes from "./routes"
import errorHandler from "./utils/errorHandler"
import globalErrorHandler from "./middleware/errorHandler.middleware"

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "common"))

// Registered routes
app.use("/api", routes)

// Not Found middleware
app.use("*", (req, res, next) => {
  next(errorHandler(404, `Route ${req.method} ${req.originalUrl} Not Found`))
})
// Error middleware
app.use(globalErrorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Enviroment: ${process.env.NODE_ENV}`)
  console.log(`Server running on port: ${process.env.PORT}`)
})
