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
	deleteOrderById,
	deletePublisherById,
} from "../../__mocks__/testFixtures"
import app from "../../app"

describe("/api/order", () => {
	const createdEmails: string[] = []
	const createdAuthorIds: number[] = []
	const createdGenreIds: number[] = []
	const createdPublisherIds: number[] = []
	const createdBookIds: number[] = []
	const createdOrderIds: number[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdOrderIds.splice(0).map(deleteOrderById))
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
			"/api/order?page=0&sort=order_date&order=desc",
		)
		assert.equal(res.status, 401)
	})

	test("POST / returns 422 for invalid body", async () => {
		const { agent } = await authedWithBook()
		const res = await agent.post("/api/order").send({})
		assert.equal(res.status, 422)
	})

	test("create → get → list → delete", async () => {
		const { agent, customerId, bookId } = await authedWithBook()

		const createRes = await agent.post("/api/order").send({
			customer_id: customerId,
			books: [{ book_id: bookId, quantity: 2 }],
		})
		assert.equal(createRes.status, 201)
		assert.equal(createRes.body.success, true)
		assert.equal(createRes.body.data.customer_id, customerId)
		const orderId = createRes.body.data.order_id as number
		createdOrderIds.push(orderId)

		const getRes = await agent.get(`/api/order/${orderId}`)
		assert.equal(getRes.status, 200)
		assert.equal(getRes.body.data.order_id, orderId)
		assert.ok(Array.isArray(getRes.body.data.OrderDetail))
		assert.equal(getRes.body.data.OrderDetail[0].book_id, bookId)
		assert.equal(getRes.body.data.OrderDetail[0].quantity, 2)

		const listRes = await agent.get(
			`/api/order?page=0&sort=order_date&order=desc&customer=${customerId}`,
		)
		assert.equal(listRes.status, 200)
		assert.equal(listRes.body.cache, false)
		assert.ok(
			listRes.body.data.some(
				(item: { order_id: number }) => item.order_id === orderId,
			),
		)

		const deleteRes = await agent.delete(`/api/order/${orderId}`)
		assert.equal(deleteRes.status, 200)
		assert.equal(deleteRes.body.message, "Order successfully deleted")

		const missingRes = await agent.get(`/api/order/${orderId}`)
		assert.equal(missingRes.status, 400)
		assert.equal(missingRes.body.message, "Order not found")
		createdOrderIds.pop()
	})

	test("GET /:id returns 400 when order does not exist", async () => {
		const { agent } = await authedWithBook()
		const res = await agent.get("/api/order/999999")
		assert.equal(res.status, 400)
		assert.equal(res.body.message, "Order not found")
	})

	test("caches list responses and invalidates after writes", async () => {
		const { agent, customerId, bookId } = await authedWithBook()
		const listUrl = `/api/order?page=0&sort=order_date&order=desc&customer=${customerId}`

		const createRes = await agent.post("/api/order").send({
			customer_id: customerId,
			books: [{ book_id: bookId, quantity: 1 }],
		})
		createdOrderIds.push(createRes.body.data.order_id)

		assert.equal((await agent.get(listUrl)).body.cache, false)
		assert.equal((await agent.get(listUrl)).body.cache, true)

		await agent.delete(`/api/order/${createRes.body.data.order_id}`).expect(200)
		createdOrderIds.pop()

		assert.equal((await agent.get(listUrl)).body.cache, false)
	})
})
