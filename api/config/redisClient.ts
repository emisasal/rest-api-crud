import { Redis } from "ioredis"

const REDIS_HOST = process.env.REDIS_HOST ?? "http://localhost"
const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? "6379", 10)

const redis = new Redis(REDIS_PORT, REDIS_HOST)

redis
  .on("connect", () => {
    console.log("Redis Connect")
  })
  .on("ready", () => {
    console.log("Redis Ready")
  })
  .on("error", (e) => {
    console.error("Redis Error: ", e)
  })
  .on("close", () => {
    console.log("Redis Close")
  })
  .on("reconnecting", () => {
    console.log("Redis Reconnecting...")
  })
  .on("end", () => {
    console.log("Redis End")
  })

export default redis
