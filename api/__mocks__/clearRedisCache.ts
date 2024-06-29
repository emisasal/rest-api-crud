import redis from "config/redisClient"

// Clear Redis cache for tests

export const clearRedisCache = async (): Promise<void> => {
  await redis.flushdb()
}
