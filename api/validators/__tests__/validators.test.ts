import assert from "node:assert/strict"
import { describe, test } from "node:test"
import { runValidators } from "../../__mocks__/runValidators"
import { postAuthorValidator } from "../author.validators"
import { getAllBooksValidator, postBookValidator } from "../book.validators"
import { postRegisterCustomerValidator } from "../customer.validators"
import { postReviewValidator } from "../review.validators"

describe("author validators", () => {
	test("postAuthorValidator rejects empty body", async () => {
		const result = await runValidators(postAuthorValidator, { body: {} })
		assert.equal(result.isEmpty(), false)
		assert.ok(
			result
				.array()
				.some(
					(err) =>
						String(err.msg).includes("first_name") ||
						String(err.msg).includes("last_name"),
				),
		)
	})

	test("postAuthorValidator accepts valid body", async () => {
		const result = await runValidators(postAuthorValidator, {
			body: {
				first_name: "Ada",
				last_name: "Lovelace",
				bio: "Mathematician",
			},
		})
		assert.equal(result.isEmpty(), true)
	})
})

describe("customer validators", () => {
	test("postRegisterCustomerValidator rejects weak password", async () => {
		const result = await runValidators(postRegisterCustomerValidator, {
			body: {
				first_name: "Test",
				last_name: "User",
				email: "test@example.com",
				password: "weak",
			},
		})
		assert.equal(result.isEmpty(), false)
	})

	test("postRegisterCustomerValidator accepts strong credentials", async () => {
		const result = await runValidators(postRegisterCustomerValidator, {
			body: {
				first_name: "Test",
				last_name: "User",
				email: "test@example.com",
				password: "TestPassw@rd1",
			},
		})
		assert.equal(result.isEmpty(), true)
	})
})

describe("book validators", () => {
	test("getAllBooksValidator requires page, sort, and order", async () => {
		const result = await runValidators(getAllBooksValidator, { query: {} })
		assert.equal(result.isEmpty(), false)
	})

	test("getAllBooksValidator rejects dateEnd before dateStart", async () => {
		const result = await runValidators(getAllBooksValidator, {
			query: {
				page: "0",
				sort: "title",
				order: "asc",
				dateStart: "2020-01-10",
				dateEnd: "2020-01-01",
			},
		})
		assert.equal(result.isEmpty(), false)
		assert.ok(
			result
				.array()
				.some(
					(err) =>
						String(err.msg).includes("dateEnd") ||
						String(err.msg).includes("greater"),
				),
		)
	})

	test("postBookValidator accepts a complete book payload", async () => {
		const result = await runValidators(postBookValidator, {
			body: {
				title: "The Hobbit",
				description: "Adventure",
				author_id: 1,
				genre_id: 1,
				publisher_id: 1,
				price: 19.99,
				publish_date: "2020-01-15T00:00:00.000Z",
				isbn: "ABC-123",
			},
		})
		assert.equal(result.isEmpty(), true)
	})
})

describe("review validators", () => {
	test("postReviewValidator rejects rating outside 1-10", async () => {
		const result = await runValidators(postReviewValidator, {
			body: {
				book_id: 1,
				customer_id: 1,
				rating: 15,
			},
		})
		assert.equal(result.isEmpty(), false)
	})

	test("postReviewValidator accepts rating in range", async () => {
		const result = await runValidators(postReviewValidator, {
			body: {
				book_id: 1,
				customer_id: 1,
				rating: 8,
				comment: "Great",
			},
		})
		assert.equal(result.isEmpty(), true)
	})
})
