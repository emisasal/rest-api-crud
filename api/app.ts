import express from "express"
import cors from "cors"

import routes from "./routes"

const port = process.env.PORT ?? 8080

const app = express()

app.use(cors()) // Enable cors
app.use(express.json())

// Registered routes
app.use("/api", routes)

// Catch unregistered routes
app.all("*", (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` })
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
