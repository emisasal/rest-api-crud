import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	createAuthenticatedAgent,
	createBookGraph,
	deleteAuthorById,
	deleteBookById,
	deleteCustomerByEmail,
	deleteGenreById,
	deletePublisherById,
	uniqueAuthor,
	uniqueBook,
	uniqueGenre,
	uniquePublisher,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/book", () => {
	const createdEmails: string[] = []
	const createdAuthorIds: number[] = []
	const createdGenreIds: number[] = []
	const createdPublisherIds: number[] = []
	const createdBookIds: number[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdBookIds.splice(0).map(deleteBookById))
		await Promise.all(createdAuthorIds.splice(0).map(deleteAuthorById))
		await Promise.all(createdGenreIds.splice(0).map(deleteGenreById))
		await Promise.all(createdPublisherIds.splice(0).map(deletePublisherById))
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	const authed = async () => {
		const { agent, customer } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)
		return agent
	}

	const trackGraph = (graph: {
		authorId: number
		genreId: number
		publisherId: number
		bookId: number
	}) => {
		createdAuthorIds.push(graph.authorId)
		createdGenreIds.push(graph.genreId)
		createdPublisherIds.push(graph.publisherId)
		createdBookIds.push(graph.bookId)
	}

	test("returns 401 without authentication", async () => {
		const res = await request(app).get("/api/book?page=0&sort=title&order=asc")
		assert.equal(res.status, 401)
	})

	test("POST / returns 422 for invalid body", async () => {
		const agent = await authed()
		const res = await agent.post("/api/book").send({})
		assert.equal(res.status, 422)
	})

	test("CRUD flow: create → get → list → patch → delete", async () => {
		const agent = await authed()

		const authorRes = await agent.post("/api/author").send(uniqueAuthor())
		const genreRes = await agent.post("/api/genre").send(uniqueGenre())
		const publisherRes = await agent
			.post("/api/publisher")
			.send(uniquePublisher())
		assert.equal(authorRes.status, 201)
		assert.equal(genreRes.status, 201)
		assert.equal(publisherRes.status, 201)

		const authorId = authorRes.body.data.author_id as number
		const genreId = genreRes.body.data.genre_id as number
		const publisherId = publisherRes.body.data.publisher_id as number
		createdAuthorIds.push(authorId)
		createdGenreIds.push(genreId)
		createdPublisherIds.push(publisherId)

		const book = uniqueBook({
			author_id: authorId,
			genre_id: genreId,
			publisher_id: publisherId,
			title: "the hobbit",
		})

		const createRes = await agent.post("/api/book").send(book)
		assert.equal(createRes.status, 201)
		assert.equal(createRes.body.data.title, "The Hobbit")
		assert.equal(createRes.body.data.isbn, book.isbn.toUpperCase())
		const bookId = createRes.body.data.book_id as number
		createdBookIds.push(bookId)

		const getRes = await agent.get(`/api/book/${bookId}`)
		assert.equal(getRes.status, 200)
		assert.equal(getRes.body.data.book_id, bookId)
		assert.ok(getRes.body.data.author)

		const listRes = await agent.get(
			"/api/book?page=0&sort=title&order=asc&title=hobbit",
		)
		assert.equal(listRes.status, 200)
		assert.equal(listRes.body.cache, false)
		assert.ok(
			listRes.body.data.some(
				(item: { book_id: number }) => item.book_id === bookId,
			),
		)

		const patchRes = await agent
			.patch(`/api/book/${bookId}`)
			.send({ description: "Updated description" })
		assert.equal(patchRes.status, 200)
		assert.equal(patchRes.body.data.description, "Updated description")
		// Existing API response typos — assert payload still present
		assert.ok(patchRes.body.data.book_id === bookId)

		const deleteRes = await agent.delete(`/api/book/${bookId}`)
		assert.equal(deleteRes.status, 200)
		assert.equal(
			deleteRes.body.message,
			`Book Id ${bookId} Successfully Deleted`,
		)

		const missingRes = await agent.get(`/api/book/${bookId}`)
		assert.equal(missingRes.status, 400)
		assert.equal(missingRes.body.message, "Book not found")
		createdBookIds.pop()
	})

	test("GET /:id returns 400 when book does not exist", async () => {
		const agent = await authed()
		const res = await agent.get("/api/book/999999")
		assert.equal(res.status, 400)
		assert.equal(res.body.message, "Book not found")
	})

	test("caches list responses and invalidates after writes", async () => {
		const agent = await authed()
		const graph = await createBookGraph(agent)
		trackGraph(graph)

		const listUrl = "/api/book?page=0&sort=title&order=asc"

		assert.equal((await agent.get(listUrl)).body.cache, false)
		assert.equal((await agent.get(listUrl)).body.cache, true)

		await agent
			.patch(`/api/book/${graph.bookId}`)
			.send({ description: "cache bust" })
			.expect(200)

		assert.equal((await agent.get(listUrl)).body.cache, false)
	})
})
