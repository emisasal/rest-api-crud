import assert from "node:assert/strict"
import { test } from "node:test"
import generateRandomString from "../generateRandomString"

const stringLength = 24

test("Returns a random string", () => {
	const randomString = generateRandomString(stringLength)

	assert.equal(typeof randomString, "string")
	assert.equal(randomString.length, stringLength)
})
