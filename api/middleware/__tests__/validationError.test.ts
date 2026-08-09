import express from "express"
import { body } from "express-validator"
import assert from "node:assert/strict"
import { describe, test } from "node:test"
import request from "supertest"
import globalErrorHandler from "../errorHandler.middleware"
import validationError from "../validationError.middleware"

const createApp = () => {
	const app = express()
	app.use(express.json())
	app.post(
		"/validate",
		body("email").isEmail().withMessage("Body 'email' must have valid format"),
		validationError,
		(_req, res) => {
			res.status(200).send({ success: true })
		},
	)
	app.use(globalErrorHandler)
	return app
}

describe("validationError middleware", () => {
	test("returns 422 when validation fails", async () => {
		const res = await request(createApp())
			.post("/validate")
			.send({ email: "not-an-email" })

		assert.equal(res.status, 422)
		assert.equal(res.body.success, false)
		assert.equal(res.body.statusCode, 422)
		assert.match(res.body.message, /email/i)
	})

	test("calls next when validation passes", async () => {
		const res = await request(createApp())
			.post("/validate")
			.send({ email: "valid@example.com" })

		assert.equal(res.status, 200)
		assert.deepEqual(res.body, { success: true })
	})
})
