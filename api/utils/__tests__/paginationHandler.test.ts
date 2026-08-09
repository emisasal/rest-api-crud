import assert from "node:assert/strict"
import { test } from "node:test"
import paginationHandler from "../paginationHandler"

const count = 55
const pageSize = 20
const actualPage = 0

test("Returns limit and page values", () => {
	const { limit, page } = paginationHandler({
		count,
		pageSize,
		page: actualPage,
	})

	assert.equal(limit, 2)
	assert.equal(page, 0)
})

test("Prevents page to be greater than 'limit'", () => {
	const { limit, page } = paginationHandler({
		count,
		pageSize,
		page: 3,
	})

	assert.equal(limit, 2)
	assert.equal(page, 2)
})
