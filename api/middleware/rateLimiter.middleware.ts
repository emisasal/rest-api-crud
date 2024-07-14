import { Request, Response, NextFunction } from "express"
import { RedisKey } from "ioredis"
import redis from "../config/redisClient"
import errorHandler from "../utils/errorHandler"

const RATE_LIMIT_PERIOD = Number(process.env.RATE_LIMIT_PERIOD as string)
const RATE_LIMIT_REQUESTS = Number(process.env.RATE_LIMIT_REQUESTS as string)
const RATE_LIMIT_BLOCKDURATION = Number(
  process.env.RATE_LIMIT_BLOCKDURATION as string
)

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress
  const { email } = req.body

  const key = `login_${ip}_${email}`

  const response: any = await redis
    .pipeline()
    .incr(key as RedisKey)
    .expire(key as RedisKey, RATE_LIMIT_PERIOD)
    .exec((err) => {
      if (err) console.error(err)
    })

  if (!response) {
    return next(errorHandler(500, "Internal Server Error"))
  }

  if (response[0][1] > RATE_LIMIT_REQUESTS) {
    await redis.expire(key as RedisKey, RATE_LIMIT_BLOCKDURATION)
    return next(errorHandler(429, "Too Many Requests"))
  }

  next()
}

export default rateLimiter
