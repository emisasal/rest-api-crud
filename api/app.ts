import express from "express"
import cors from "cors"
import morgan from "morgan"
import { corsOptions } from "./config/corsOptions"
import routes from "./routes"
import globalErrorHandler from "./middleware/errorHandler.middleware"
import notFoundHandler from "./middleware/notFound.middleware"

const app = express()

app.use(cors(corsOptions))
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "common"))
app.use(express.json())

// Registered routes
app.use("/api", routes)

// Not Found middleware
app.use(notFoundHandler)
// Error middleware
app.use(globalErrorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Enviroment: ${process.env.NODE_ENV}`)
  console.log(`Server running on port: ${process.env.PORT}`)
})
