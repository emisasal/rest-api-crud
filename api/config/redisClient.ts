import { Redis } from "ioredis"
import redisMock from "ioredis-mock"

const { REDIS_HOST, REDIS_USERNAME, REDIS_PASSWORD } = process.env
const REDIS_PORT = parseInt(process.env.REDIS_PORT as string, 10)

const redis =
  process.env.NODE_ENV === "test"
    ? new redisMock()
    : new Redis({
        port: REDIS_PORT,
        host: REDIS_HOST,
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
        showFriendlyErrorStack: true,
      })

process.env.NODE_ENV !== "test" &&
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
