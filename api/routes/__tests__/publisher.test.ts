import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	createAuthenticatedAgent,
	deleteCustomerByEmail,
	deletePublisherById,
	uniquePublisher,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/publisher", () => {
	const createdEmails: string[] = []
	const createdPublisherIds: number[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdPublisherIds.splice(0).map(deletePublisherById))
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	const authed = async () => {
		const { agent, customer } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)
		return agent
	}

	test("returns 401 without authentication", async () => {
		const res = await request(app).get("/api/publisher?page=0&order=asc")
		assert.equal(res.status, 401)
	})

	test("POST / returns 422 for invalid body", async () => {
		const agent = await authed()
		const res = await agent.post("/api/publisher").send({})
		assert.equal(res.status, 422)
	})

	test("CRUD flow: create → get → list → patch → delete", async () => {
		const agent = await authed()
		const publisher = uniquePublisher({
			publisher_name: "penguin books",
			phone_number: "555-1234",
		})

		const createRes = await agent.post("/api/publisher").send(publisher)
		assert.equal(createRes.status, 201)
		assert.equal(createRes.body.data.publisher_name, "Penguin Books")
		assert.equal(createRes.body.data.phone_number, "555-1234")
		const publisherId = createRes.body.data.publisher_id as number
		createdPublisherIds.push(publisherId)

		const getRes = await agent.get(`/api/publisher/${publisherId}`)
		assert.equal(getRes.status, 200)
		assert.equal(getRes.body.data.publisher_id, publisherId)

		const listRes = await agent.get(
			"/api/publisher?page=0&order=asc&name=penguin",
		)
		assert.equal(listRes.status, 200)
		assert.equal(listRes.body.cache, false)
		assert.ok(
			listRes.body.data.some(
				(item: { publisher_id: number }) => item.publisher_id === publisherId,
			),
		)

		const patchRes = await agent
			.patch(`/api/publisher/${publisherId}`)
			.send({ contact_name: "new contact" })
		assert.equal(patchRes.status, 200)
		assert.equal(patchRes.body.data.contact_name, "New Contact")

		const deleteRes = await agent.delete(`/api/publisher/${publisherId}`)
		assert.equal(deleteRes.status, 200)
		assert.equal(deleteRes.body.message, "Publisher successfully deleted")

		const missingRes = await agent.get(`/api/publisher/${publisherId}`)
		assert.equal(missingRes.status, 400)
		assert.equal(missingRes.body.message, "Publisher not found")
		createdPublisherIds.pop()
	})

	test("POST / returns 409 for duplicate publisher", async () => {
		const agent = await authed()
		const publisher = uniquePublisher()

		const first = await agent.post("/api/publisher").send(publisher)
		assert.equal(first.status, 201)
		createdPublisherIds.push(first.body.data.publisher_id)

		const second = await agent.post("/api/publisher").send(publisher)
		assert.equal(second.status, 409)
		assert.equal(second.body.message, "Publisher already registred")
	})

	test("caches list responses and invalidates after writes", async () => {
		const agent = await authed()
		const listUrl = "/api/publisher?page=0&order=asc&name="

		const createRes = await agent.post("/api/publisher").send(uniquePublisher())
		createdPublisherIds.push(createRes.body.data.publisher_id)

		assert.equal((await agent.get(listUrl)).body.cache, false)
		assert.equal((await agent.get(listUrl)).body.cache, true)

		await agent
			.patch(`/api/publisher/${createRes.body.data.publisher_id}`)
			.send({ contact_name: "cache bust" })
			.expect(200)

		assert.equal((await agent.get(listUrl)).body.cache, false)
	})
})
