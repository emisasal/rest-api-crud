import app from "./app"

app.listen(process.env.PORT, () => {
  console.log(`Enviroment: ${process.env.NODE_ENV}`)
  console.log(`Server running on port: ${process.env.PORT}`)
  // console.log("Memory usage:", process.memoryUsage()) // Uncomment to log memory usage
})
