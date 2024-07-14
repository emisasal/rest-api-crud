import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible"
import { Request, Response, NextFunction } from "express"
import redis from "config/redisClient"
import errorHandler from "utils/errorHandler"

const opts = {
  storeClient: redis,
  points: 10, // Number of points
  duration: 10, // Per second(s)
  blockDuration: 60 * 60 * 24, // 1 day
  keyPrefix: "login_", // must be unique for limiters with different purpose
  insuranceLimiter: new RateLimiterMemory({
    points: 10,
    duration: 10,
    blockDuration: 60 * 60 * 24, // 1 day
  }), // Memory-based insurance limiter
}

export const rateLimiterBrute = new RateLimiterRedis(opts)

// @desc Brute force Rate Limiter using Redis with memory backup
const bruteForceRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ip = req.ip || req.socket.remoteAddress
    const { email } = req.body
    await rateLimiterBrute.consume(`${ip}_${email}`)
    return next()
  } catch (error) {
    return next(errorHandler(429, "Too Many Requests"))
  }
}

export default bruteForceRateLimiter
