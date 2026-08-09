import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	createAuthenticatedAgent,
	deleteCustomerByEmail,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/category", () => {
	const createdEmails: string[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	test("returns 401 without authentication", async () => {
		const res = await request(app).get("/api/category")

		assert.equal(res.status, 401)
		assert.equal(res.body.message, "Unauthorized")
	})

	test("returns models list when authenticated", async () => {
		const { agent, customer } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)

		const res = await agent.get("/api/category")

		assert.equal(res.status, 200)
		assert.equal(res.body.success, true)
		assert.ok(Array.isArray(res.body.data))
		assert.ok(res.body.data.includes("Customer"))
		assert.ok(res.body.data.includes("Book"))
	})
})
