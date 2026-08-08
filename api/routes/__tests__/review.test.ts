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
	deleteReviewById,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/review", () => {
	const createdEmails: string[] = []
	const createdAuthorIds: number[] = []
	const createdGenreIds: number[] = []
	const createdPublisherIds: number[] = []
	const createdBookIds: number[] = []
	const createdReviewIds: number[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdReviewIds.splice(0).map(deleteReviewById))
		await Promise.all(createdBookIds.splice(0).map(deleteBookById))
		await Promise.all(createdAuthorIds.splice(0).map(deleteAuthorById))
		await Promise.all(createdGenreIds.splice(0).map(deleteGenreById))
		await Promise.all(createdPublisherIds.splice(0).map(deletePublisherById))
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	const authedWithBook = async () => {
		const { agent, customer, customerId } = await createAuthenticatedAgent()
		createdEmails.push(customer.email)
		const graph = await createBookGraph(agent)
		createdAuthorIds.push(graph.authorId)
		createdGenreIds.push(graph.genreId)
		createdPublisherIds.push(graph.publisherId)
		createdBookIds.push(graph.bookId)
		return { agent, customerId, bookId: graph.bookId }
	}

	test("returns 401 without authentication", async () => {
		const res = await request(app).get(
			"/api/review?page=0&sort=rating&order=desc",
		)
		assert.equal(res.status, 401)
	})

	test("POST / returns 422 for invalid body", async () => {
		const { agent } = await authedWithBook()
		const res = await agent.post("/api/review").send({})
		assert.equal(res.status, 422)
	})

	test("create → get → list → delete", async () => {
		const { agent, customerId, bookId } = await authedWithBook()

		const createRes = await agent.post("/api/review").send({
			book_id: bookId,
			customer_id: customerId,
			rating: 8,
			comment: "Great book",
		})
		assert.equal(createRes.status, 201)
		assert.equal(createRes.body.data.rating, 8)
		assert.equal(createRes.body.data.comment, "Great book")
		const reviewId = createRes.body.data.review_id as number
		createdReviewIds.push(reviewId)

		const getRes = await agent.get(`/api/review/${reviewId}`)
		assert.equal(getRes.status, 200)
		assert.equal(getRes.body.data.review_id, reviewId)

		const listRes = await agent.get(
			`/api/review?page=0&sort=rating&order=desc&book_id=${bookId}`,
		)
		assert.equal(listRes.status, 200)
		assert.equal(listRes.body.cache, false)
		assert.ok(
			listRes.body.data.some(
				(item: { review_id: number }) => item.review_id === reviewId,
			),
		)

		const deleteRes = await agent.delete(`/api/review/${reviewId}`)
		assert.equal(deleteRes.status, 200)
		assert.equal(deleteRes.body.message, "Review successfully deleted")

		const missingRes = await agent.get(`/api/review/${reviewId}`)
		assert.equal(missingRes.status, 400)
		assert.equal(missingRes.body.message, "Review not found")
		createdReviewIds.pop()
	})

	test("POST / returns 400 for duplicate review", async () => {
		const { agent, customerId, bookId } = await authedWithBook()
		const payload = {
			book_id: bookId,
			customer_id: customerId,
			rating: 7,
		}

		const first = await agent.post("/api/review").send(payload)
		assert.equal(first.status, 201)
		createdReviewIds.push(first.body.data.review_id)

		const second = await agent.post("/api/review").send(payload)
		assert.equal(second.status, 400)
		assert.equal(second.body.message, "Review for book already exist")
	})

	test("caches list responses and invalidates after writes", async () => {
		const { agent, customerId, bookId } = await authedWithBook()
		const listUrl = `/api/review?page=0&sort=rating&order=desc&book_id=${bookId}`

		const createRes = await agent.post("/api/review").send({
			book_id: bookId,
			customer_id: customerId,
			rating: 9,
		})
		createdReviewIds.push(createRes.body.data.review_id)

		assert.equal((await agent.get(listUrl)).body.cache, false)
		assert.equal((await agent.get(listUrl)).body.cache, true)

		await agent
			.delete(`/api/review/${createRes.body.data.review_id}`)
			.expect(200)
		createdReviewIds.pop()

		assert.equal((await agent.get(listUrl)).body.cache, false)
	})
})
