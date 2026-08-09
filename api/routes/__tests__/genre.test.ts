import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	createAuthenticatedAgent,
	deleteCustomerByEmail,
	deleteGenreById,
	uniqueGenre,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/genre", () => {
	const createdEmails: string[] = []
	const createdGenreIds: number[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdGenreIds.splice(0).map(deleteGenreById))
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	const authed = async () => {
		const { agent, customer } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)
		return agent
	}

	test("returns 401 without authentication", async () => {
		const res = await request(app).get("/api/genre?page=0&order=asc")
		assert.equal(res.status, 401)
	})

	test("POST / returns 422 for invalid body", async () => {
		const agent = await authed()
		const res = await agent.post("/api/genre").send({})
		assert.equal(res.status, 422)
	})

	test("CRUD flow: create → get → list → patch → delete", async () => {
		const agent = await authed()
		const genre = uniqueGenre({ name: "Science Fiction" })

		const createRes = await agent.post("/api/genre").send(genre)
		assert.equal(createRes.status, 201)
		assert.equal(createRes.body.data.name, "science fiction")
		const genreId = createRes.body.data.genre_id as number
		createdGenreIds.push(genreId)

		const getRes = await agent.get(`/api/genre/${genreId}`)
		assert.equal(getRes.status, 200)
		assert.equal(getRes.body.data.genre_id, genreId)

		const listRes = await agent.get("/api/genre?page=0&order=asc&name=science")
		assert.equal(listRes.status, 200)
		assert.equal(listRes.body.cache, false)
		assert.ok(
			listRes.body.data.some(
				(item: { genre_id: number }) => item.genre_id === genreId,
			),
		)

		const patchRes = await agent
			.patch(`/api/genre/${genreId}`)
			.send({ description: "Updated description" })
		assert.equal(patchRes.status, 200)
		assert.equal(patchRes.body.data.description, "Updated description")

		const deleteRes = await agent.delete(`/api/genre/${genreId}`)
		assert.equal(deleteRes.status, 200)
		assert.equal(deleteRes.body.message, "Genre successfully deleted")

		const missingRes = await agent.get(`/api/genre/${genreId}`)
		assert.equal(missingRes.status, 400)
		assert.equal(missingRes.body.message, "Genre Not Found")
		createdGenreIds.pop()
	})

	test("POST / returns 400 for duplicate genre", async () => {
		const agent = await authed()
		const genre = uniqueGenre()

		const first = await agent.post("/api/genre").send(genre)
		assert.equal(first.status, 201)
		createdGenreIds.push(first.body.data.genre_id)

		const second = await agent.post("/api/genre").send(genre)
		assert.equal(second.status, 400)
		assert.equal(second.body.message, "Genre already registred")
	})

	test("caches list responses and invalidates after writes", async () => {
		const agent = await authed()
		const listUrl = "/api/genre?page=0&order=asc&name="

		const createRes = await agent.post("/api/genre").send(uniqueGenre())
		createdGenreIds.push(createRes.body.data.genre_id)

		const firstList = await agent.get(listUrl)
		assert.equal(firstList.body.cache, false)

		const cachedList = await agent.get(listUrl)
		assert.equal(cachedList.body.cache, true)

		await agent
			.patch(`/api/genre/${createRes.body.data.genre_id}`)
			.send({ description: "cache bust" })
			.expect(200)

		const afterPatch = await agent.get(listUrl)
		assert.equal(afterPatch.body.cache, false)
	})
})
