import express from "express"
import assert from "node:assert/strict"
import { describe, test } from "node:test"
import request from "supertest"
import globalErrorHandler from "../errorHandler.middleware"
import notFoundHandler from "../notFound.middleware"

const createApp = () => {
	const app = express()
	app.get("/exists", (_req, res) => {
		res.status(200).send({ success: true })
	})
	app.use(notFoundHandler)
	app.use(globalErrorHandler)
	return app
}

describe("notFound middleware", () => {
	test("returns 404 for unknown routes", async () => {
		const res = await request(createApp()).get("/missing-route")

		assert.equal(res.status, 404)
		assert.equal(res.body.success, false)
		assert.equal(res.body.statusCode, 404)
		assert.match(res.body.message, /GET \/missing-route/i)
		assert.match(res.body.message, /Not found/i)
	})

	test("does not intercept existing routes", async () => {
		const res = await request(createApp()).get("/exists")

		assert.equal(res.status, 200)
		assert.deepEqual(res.body, { success: true })
	})
})
