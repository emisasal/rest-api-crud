import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible"
import redis from "config/redisClient"
import { NextFunction } from "express"

const opts = {
  storeClient: redis,
  points: 10, // Number of points
  duration: 60, // Per second(s)
  //   blockDuration: 60 * 60 * 24, // 1 day
  keyPrefix: "login_", // must be unique for limiters with different purpose
  insuranceLimiter: new RateLimiterMemory({
    points: 10,
    duration: 10,
    //   blockDuration: 60 * 60 * 24, // 1 day
  }), // Memory-based insurance limiter
}

const rateLimiter = new RateLimiterRedis(opts)

export const bruteForceRateLimiter = async (key: string) => {
  try {
    const consumed = await rateLimiter.consume(key)
    return consumed
  } catch (error) {
    throw new Error()
  }

//   await rateLimiter
//     .consume(`${ip}_${email}`)
//     .then(() => {
//       next()
//     })
//     .catch(() => {
//       return next(errorHandler(429, "Too Many Requests"))
//     })
}
