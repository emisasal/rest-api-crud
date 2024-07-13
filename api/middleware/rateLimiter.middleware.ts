import { Request, Response, NextFunction } from "express"
import { RedisKey } from "ioredis"
import redis from "../config/redisClient"
import errorHandler from "../utils/errorHandler"

// @desc Pure Redis Rate Limiter
const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress
  const { email } = req.body

  const key = `login_${ip}_${email}`

  const response: any = await redis
    .pipeline()
    .incr(key as RedisKey)
    .expire(key as RedisKey, 10) // seconds
    .exec((err) => {
      if (err) console.error(err)
    })

  if (!response) {
    return next(errorHandler(500, "Internal Server Error"))
  }

  if (response[0][1] > 10) {
    await redis.expire(key as RedisKey, 60 * 60 * 24)
    return next(errorHandler(429, "Too Many Requests"))
  }

  next()
}

export default rateLimiter
