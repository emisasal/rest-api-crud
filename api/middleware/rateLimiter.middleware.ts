import redis from "config/redisClient"
import { Request, Response, NextFunction } from "express"
import { RedisKey } from "ioredis"
import errorHandler from "utils/errorHandler"

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip
  const response: any = await redis
    .multi()
    .incr(ip as RedisKey)
    .expire(ip as RedisKey, 60) // seconds
    .exec()

  if (response[0][1] > 10) {
    return next(errorHandler(429, "Too Many Requests"))
  }
  next()
}

export default rateLimiter
