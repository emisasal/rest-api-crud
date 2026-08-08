import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	createAuthenticatedAgent,
	deleteAuthorById,
	deleteCustomerByEmail,
	uniqueAuthor,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/author", () => {
	const createdEmails: string[] = []
	const createdAuthorIds: number[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdAuthorIds.splice(0).map(deleteAuthorById))
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	const authed = async () => {
		const { agent, customer } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)
		return agent
	}

	test("returns 401 without authentication", async () => {
		const res = await request(app).get("/api/author?page=0")

		assert.equal(res.status, 401)
		assert.equal(res.body.message, "Unauthorized")
	})

	test("POST / returns 422 for invalid body", async () => {
		const agent = await authed()

		const res = await agent.post("/api/author").send({})

		assert.equal(res.status, 422)
		assert.equal(res.body.success, false)
		assert.equal(res.body.statusCode, 422)
	})

	test("CRUD flow: create → get → list → patch → delete", async () => {
		const agent = await authed()
		const author = uniqueAuthor({
			first_name: "ada",
			last_name: "lovelace",
			bio: "Mathematician",
		})

		const createRes = await agent.post("/api/author").send(author)
		assert.equal(createRes.status, 201)
		assert.equal(createRes.body.success, true)
		assert.equal(createRes.body.data.first_name, "Ada")
		assert.equal(createRes.body.data.last_name, "Lovelace")
		assert.equal(createRes.body.data.bio, "Mathematician")

		const authorId = createRes.body.data.author_id as number
		createdAuthorIds.push(authorId)

		const getRes = await agent.get(`/api/author/${authorId}`)
		assert.equal(getRes.status, 200)
		assert.equal(getRes.body.data.author_id, authorId)
		assert.equal(getRes.body.data.first_name, "Ada")

		const listRes = await agent.get(
			"/api/author?page=0&sort=last_name&order=asc&name=lovelace",
		)
		assert.equal(listRes.status, 200)
		assert.equal(listRes.body.success, true)
		assert.equal(listRes.body.cache, false)
		assert.ok(Array.isArray(listRes.body.data))
		assert.ok(
			listRes.body.data.some(
				(item: { author_id: number }) => item.author_id === authorId,
			),
		)

		const patchRes = await agent
			.patch(`/api/author/${authorId}`)
			.send({ bio: "First computer programmer" })
		assert.equal(patchRes.status, 200)
		assert.equal(patchRes.body.data.bio, "First computer programmer")
		assert.equal(patchRes.body.data.first_name, "Ada")

		const deleteRes = await agent.delete(`/api/author/${authorId}`)
		assert.equal(deleteRes.status, 200)
		assert.equal(deleteRes.body.message, "Author successfully deleted")

		const missingRes = await agent.get(`/api/author/${authorId}`)
		assert.equal(missingRes.status, 400)
		assert.equal(missingRes.body.message, "Author not found")

		// Already deleted — avoid afterEach deleteMany noise
		createdAuthorIds.pop()
	})

	test("POST / returns 400 for duplicate author", async () => {
		const agent = await authed()
		const author = uniqueAuthor()

		const first = await agent.post("/api/author").send(author)
		assert.equal(first.status, 201)
		createdAuthorIds.push(first.body.data.author_id)

		const second = await agent.post("/api/author").send(author)
		assert.equal(second.status, 400)
		assert.equal(second.body.message, "Author already registred")
	})

	test("GET /:id returns 400 when author does not exist", async () => {
		const agent = await authed()

		const res = await agent.get("/api/author/999999")

		assert.equal(res.status, 400)
		assert.equal(res.body.message, "Author not found")
	})

	test("caches list responses and invalidates after writes", async () => {
		const agent = await authed()
		const author = uniqueAuthor()
		const listUrl = "/api/author?page=0&sort=last_name&order=asc&name="

		const createRes = await agent.post("/api/author").send(author)
		assert.equal(createRes.status, 201)
		createdAuthorIds.push(createRes.body.data.author_id)

		const firstList = await agent.get(listUrl)
		assert.equal(firstList.status, 200)
		assert.equal(firstList.body.cache, false)

		const cachedList = await agent.get(listUrl)
		assert.equal(cachedList.status, 200)
		assert.equal(cachedList.body.cache, true)
		assert.deepEqual(cachedList.body.data, firstList.body.data)

		await agent
			.patch(`/api/author/${createRes.body.data.author_id}`)
			.send({ bio: "Updated bio for cache bust" })
			.expect(200)

		const afterPatch = await agent.get(listUrl)
		assert.equal(afterPatch.status, 200)
		assert.equal(afterPatch.body.cache, false)
	})
})
