import express from "express"
import assert from "node:assert/strict"
import { describe, test } from "node:test"
import request from "supertest"
import { Prisma } from "../../../prisma/generated/prisma/index.js"
import CustomError from "../../classes/CustomError"
import globalErrorHandler from "../errorHandler.middleware"

const createApp = (errFactory: () => unknown) => {
	const app = express()
	app.get("/error", (_req, _res, next) => {
		next(errFactory())
	})
	app.use(globalErrorHandler)
	return app
}

describe("globalErrorHandler middleware", () => {
	test("returns CustomError status and message", async () => {
		const res = await request(
			createApp(() => new CustomError(409, "Conflict happened")),
		).get("/error")

		assert.equal(res.status, 409)
		assert.deepEqual(res.body, {
			success: false,
			statusCode: 409,
			message: "Conflict happened",
		})
	})

	test("maps Prisma known request errors to 400", async () => {
		const prismaError = new Prisma.PrismaClientKnownRequestError(
			"Record missing",
			{
				code: "P2025",
				clientVersion: "test",
				meta: { cause: "Record to delete does not exist." },
			},
		)

		const res = await request(createApp(() => prismaError)).get("/error")

		assert.equal(res.status, 400)
		assert.deepEqual(res.body, {
			success: false,
			statusCode: 400,
			message: "Record to delete does not exist.",
		})
	})

	test("falls back to 500 for unknown errors", async () => {
		const res = await request(createApp(() => new Error("boom"))).get("/error")

		assert.equal(res.status, 500)
		assert.deepEqual(res.body, {
			success: false,
			statusCode: 500,
			message: "boom",
		})
	})
})
