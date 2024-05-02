import express from "express"
import cors from "cors"
import morgan from "morgan"

import routes from "./routes"

const app = express()

app.use(cors()) // Enable cors
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "common")) // http logger
app.use(express.json())

// Registered routes
app.use("/api", routes)

// Catch unregistered routes
app.all("*", (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` })
})

app.listen(process.env.PORT, () => {
  console.log(`Enviroment: ${process.env.NODE_ENV}`)
  console.log(`Server running on port: ${process.env.PORT}`)
})
