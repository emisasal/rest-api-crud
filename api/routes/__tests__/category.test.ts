import { after, describe, test } from "node:test"
import redis from "../../config/redisClient"

after(async () => {
	await redis.quit()
})

describe("/api/category", () => {
	test.todo("Returns models list")
})
