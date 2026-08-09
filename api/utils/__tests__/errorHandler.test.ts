import assert from "node:assert/strict"
import { test } from "node:test"
import errorHandler from "../errorHandler"

const statusCode = 400
const errorMessage = "Error message"

test("Returns error with params", () => {
	const newError = errorHandler(statusCode, errorMessage)

	assert.equal(newError.status, statusCode)
	assert.equal(newError.message, errorMessage)
})
