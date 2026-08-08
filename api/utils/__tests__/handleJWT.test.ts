import jwt from "jsonwebtoken"
import assert from "node:assert/strict"
import { test } from "node:test"
import { signAccessJWT, signRefreshJWT } from "../handleJWT"

const testId = 1050

test("signAccessJWT creates a verifiable token", () => {
	assert.ok(process.env.JWT_ACCESS_SECRET)

	const accessToken = signAccessJWT(testId)

	assert.equal(typeof accessToken, "string")
	assert.ok(accessToken.length > 0)

	const payload = jwt.verify(
		accessToken,
		process.env.JWT_ACCESS_SECRET as string,
	) as jwt.JwtPayload
	assert.equal(String(payload.sub), String(testId))
})

test("signRefreshJWT creates a verifiable token", () => {
	assert.ok(process.env.JWT_REFRESH_SECRET)

	const refreshToken = signRefreshJWT(testId)

	assert.equal(typeof refreshToken, "string")
	assert.ok(refreshToken.length > 0)

	const payload = jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET as string,
	) as jwt.JwtPayload
	assert.equal(String(payload.sub), String(testId))
})
