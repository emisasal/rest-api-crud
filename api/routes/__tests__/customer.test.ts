import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	createAuthenticatedAgent,
	deleteCustomerByEmail,
	uniqueCustomer,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/customer", () => {
	const createdEmails: string[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	test("returns 401 without authentication", async () => {
		const res = await request(app).get(
			"/api/customer?page=0&sort=last_name&order=asc",
		)
		assert.equal(res.status, 401)
	})

	test("list → get → patch → delete for authenticated customer", async () => {
		const { agent, customer, customerId } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)

		const listRes = await agent.get(
			`/api/customer?page=0&sort=last_name&order=asc&email=${customer.email}`,
		)
		assert.equal(listRes.status, 200)
		assert.equal(listRes.body.cache, false)
		assert.ok(
			listRes.body.data.some(
				(item: { customer_id: number }) => item.customer_id === customerId,
			),
		)
		assert.ok(
			listRes.body.data.every(
				(item: { password?: string }) => item.password === undefined,
			),
		)

		const getRes = await agent.get(`/api/customer/${customerId}`)
		assert.equal(getRes.status, 200)
		assert.equal(getRes.body.data.customer_id, customerId)
		assert.equal(getRes.body.data.email, customer.email.toLowerCase())

		const patchRes = await agent
			.patch(`/api/customer/${customerId}`)
			.send({ first_name: "updated" })
		assert.equal(patchRes.status, 200)
		assert.equal(patchRes.body.data.first_name, "Updated")
		assert.equal(patchRes.body.data.password, undefined)

		const deleteRes = await agent.delete(`/api/customer/${customerId}`)
		assert.equal(deleteRes.status, 200)
		assert.equal(deleteRes.body.message, "Customer successfully deleted")

		const missingRes = await agent.get(`/api/customer/${customerId}`)
		assert.equal(missingRes.status, 400)
		assert.equal(missingRes.body.message, "Customer not found")

		// Already deleted
		createdEmails.pop()
	})

	test("GET /:id returns 400 when customer does not exist", async () => {
		const { agent, customer } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)

		const res = await agent.get("/api/customer/999999")
		assert.equal(res.status, 400)
		assert.equal(res.body.message, "Customer not found")
	})

	test("PATCH / returns 422 for invalid body", async () => {
		const { agent, customer, customerId } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)

		const res = await agent
			.patch(`/api/customer/${customerId}`)
			.send({ email: "not-an-email" })
		assert.equal(res.status, 422)
	})

	test("caches list responses and invalidates after writes", async () => {
		const { agent, customer, customerId } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)

		const other = uniqueCustomer()
		await agent.post("/api/customer/register").send(other).expect(201)
		createdEmails.push(other.email)

		const listUrl = "/api/customer?page=0&sort=last_name&order=asc"

		assert.equal((await agent.get(listUrl)).body.cache, false)
		assert.equal((await agent.get(listUrl)).body.cache, true)

		await agent
			.patch(`/api/customer/${customerId}`)
			.send({ last_name: "cachebust" })
			.expect(200)

		assert.equal((await agent.get(listUrl)).body.cache, false)
	})
})
