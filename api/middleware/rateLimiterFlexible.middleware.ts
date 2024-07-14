import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible"
import { Request, Response, NextFunction } from "express"
import redis from "config/redisClient"
import errorHandler from "utils/errorHandler"

const RATE_LIMIT_REQUESTS = Number(process.env.RATE_LIMIT_REQUESTS as string)
const RATE_LIMIT_PERIOD = Number(process.env.RATE_LIMIT_PERIOD as string)
const RATE_LIMIT_BLOCKDURATION = Number(
  process.env.RATE_LIMIT_BLOCKDURATION as string
)

const opts = {
  storeClient: redis,
  points: RATE_LIMIT_REQUESTS,
  duration: RATE_LIMIT_PERIOD,
  blockDuration: RATE_LIMIT_BLOCKDURATION,
  keyPrefix: "login_", // must be unique for limiters with different purpose
  insuranceLimiter: new RateLimiterMemory({
    points: RATE_LIMIT_REQUESTS,
    duration: RATE_LIMIT_PERIOD,
    blockDuration: RATE_LIMIT_BLOCKDURATION,
  }), // Memory-based insurance limiter
}

export const rateLimiterRedis = new RateLimiterRedis(opts)

const rateLimiterFlexible = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ip = req.ip || req.socket.remoteAddress
    const { email } = req.body
    await rateLimiterRedis.consume(`${ip}_${email}`)
    return next()
  } catch (error) {
    return next(errorHandler(429, "Too Many Requests"))
  }
}

export default rateLimiterFlexible
