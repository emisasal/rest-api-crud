import { after, describe, test } from "node:test"
import request from "supertest"
import app from "../../app"
import redis from "../../config/redisClient"

describe("customerSession routes", () => {
	after(async () => {
		await redis.quit()
	})

	describe("/customer/register", () => {
		test.skip("Register new user", async () => {
			await request(app).post("/api/customer/register")
		})
	})
})
