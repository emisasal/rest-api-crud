import express from "express"
import assert from "node:assert/strict"
import { beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import globalErrorHandler from "../errorHandler.middleware"
import rateLimiter from "../rateLimiter.middleware"

const RATE_LIMIT_REQUESTS = Number(process.env.RATE_LIMIT_REQUESTS || 5)

const createApp = () => {
	const app = express()
	app.use(express.json())
	app.post("/limited", rateLimiter, (_req, res) => {
		res.status(200).send({ success: true })
	})
	app.use(globalErrorHandler)
	return app
}

describe("rateLimiter middleware", () => {
	beforeEach(async () => {
		await clearRedisCache()
	})

	test("allows requests under the limit", async () => {
		const app = createApp()
		const res = await request(app)
			.post("/limited")
			.send({ email: "under-limit@example.com" })

		assert.equal(res.status, 200)
		assert.deepEqual(res.body, { success: true })
	})

	test("returns 429 when the limit is exceeded", async () => {
		const app = createApp()
		const email = "over-limit@example.com"

		for (let i = 0; i < RATE_LIMIT_REQUESTS; i++) {
			const res = await request(app).post("/limited").send({ email })
			assert.equal(res.status, 200)
		}

		const blocked = await request(app).post("/limited").send({ email })
		assert.equal(blocked.status, 429)
		assert.equal(blocked.body.success, false)
		assert.equal(blocked.body.message, "Too Many Requests")
	})
})
