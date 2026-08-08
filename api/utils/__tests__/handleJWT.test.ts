import assert from "node:assert/strict"
import { test } from "node:test"
import { signAccessJWT, signRefreshJWT } from "../handleJWT"

const testId = 1050

test.skip("signAccessJWT creates new token", () => {
	const accessToken = signAccessJWT(testId)

	assert.ok(accessToken)
	assert.equal(typeof accessToken, "string")
})

test.skip("signRefreshJWT creates new token", () => {
	const accessToken = signRefreshJWT(testId)

	assert.ok(accessToken)
	assert.equal(typeof accessToken, "string")
})
