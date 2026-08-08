import type { NextFunction, Request, Response } from "express"
import assert from "node:assert/strict"
import { beforeEach, describe, mock, test } from "node:test"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import redis from "../../config/redisClient"
import { signAccessJWT, signRefreshJWT } from "../../utils/handleJWT"
import verifyJWT from "../verifyJWT"

const createRes = () => {
	const res = {
		clearCookie: mock.fn(),
		cookie: mock.fn(),
		status: mock.fn(),
		send: mock.fn(),
		end: mock.fn(),
	}
	res.clearCookie.mock.mockImplementation(() => res)
	res.cookie.mock.mockImplementation(() => res)
	res.status.mock.mockImplementation(() => res)
	res.send.mock.mockImplementation(() => res)
	res.end.mock.mockImplementation(() => res)
	return res as unknown as Response & {
		clearCookie: ReturnType<typeof mock.fn>
		cookie: ReturnType<typeof mock.fn>
		status: ReturnType<typeof mock.fn>
		send: ReturnType<typeof mock.fn>
		end: ReturnType<typeof mock.fn>
	}
}

describe("verifyJWT", () => {
	beforeEach(async () => {
		await clearRedisCache()
	})

	test("returns 401 when refresh token is missing", async () => {
		const req = { signedCookies: {} } as Request
		const res = createRes()
		const next = mock.fn() as unknown as NextFunction

		await verifyJWT(req, res, next)

		assert.equal(res.status.mock.calls[0]?.arguments[0], 401)
		assert.deepEqual(res.send.mock.calls[0]?.arguments[0], {
			success: false,
			statusCode: 401,
			message: "Unauthorized",
		})
		assert.equal((next as ReturnType<typeof mock.fn>).mock.callCount(), 0)
	})

	test("returns 401 when Redis session does not match refresh token", async () => {
		const customerId = 42
		const refreshToken = signRefreshJWT(customerId)
		await redis.set(`session:${customerId}`, JSON.stringify("other-token"))

		const req = {
			signedCookies: { refresh_token: refreshToken },
		} as Request
		const res = createRes()
		const next = mock.fn() as unknown as NextFunction

		await verifyJWT(req, res, next)

		assert.equal(res.status.mock.calls[0]?.arguments[0], 401)
		assert.equal((next as ReturnType<typeof mock.fn>).mock.callCount(), 0)
		assert.equal(await redis.get(`session:${customerId}`), null)
	})

	test("issues a new access token when access token is missing", async () => {
		const customerId = 77
		const refreshToken = signRefreshJWT(customerId)
		await redis.set(`session:${customerId}`, JSON.stringify(refreshToken))

		const req = {
			signedCookies: { refresh_token: refreshToken },
		} as Request
		const res = createRes()
		const next = mock.fn() as unknown as NextFunction

		await verifyJWT(req, res, next)

		assert.equal(res.cookie.mock.callCount(), 1)
		assert.equal(res.cookie.mock.calls[0]?.arguments[0], "access_token")
		assert.equal((next as ReturnType<typeof mock.fn>).mock.callCount(), 1)
	})

	test("calls next when access and refresh tokens are valid", async () => {
		const customerId = 99
		const refreshToken = signRefreshJWT(customerId)
		const accessToken = signAccessJWT(customerId)
		await redis.set(`session:${customerId}`, JSON.stringify(refreshToken))

		const req = {
			signedCookies: {
				refresh_token: refreshToken,
				access_token: accessToken,
			},
		} as Request
		const res = createRes()
		const next = mock.fn() as unknown as NextFunction

		await verifyJWT(req, res, next)

		assert.equal(res.cookie.mock.callCount(), 0)
		assert.equal(res.status.mock.callCount(), 0)
		assert.equal((next as ReturnType<typeof mock.fn>).mock.callCount(), 1)
	})
})
