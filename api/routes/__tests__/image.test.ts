import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	createAuthenticatedAgent,
	deleteCustomerByEmail,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/image", () => {
	const createdEmails: string[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	test("returns 401 without authentication", async () => {
		const res = await request(app).get("/api/image/1")
		assert.equal(res.status, 401)
	})

	test("returns 422 when image file does not exist", async () => {
		const { agent, customer } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)

		const res = await agent.get("/api/image/999999")
		assert.equal(res.status, 422)
		assert.match(res.body.message, /Unable to get image 999999\.jpg/)
	})
})
