import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, test } from "node:test"
import request from "supertest"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	deleteCustomerByEmail,
	uniqueCustomer,
} from "../../__mocks__/testFixtures"
import app from "../../app"
import redis from "../../config/redisClient"

describe("customerSession routes", () => {
	const createdEmails: string[] = []

	beforeEach(async () => {
		await clearRedisCache()
	})

	afterEach(async () => {
		await Promise.all(createdEmails.splice(0).map(deleteCustomerByEmail))
		await clearRedisCache()
	})

	test("POST /customer/register returns 422 for invalid body", async () => {
		const res = await request(app).post("/api/customer/register").send({})

		assert.equal(res.status, 422)
		assert.equal(res.body.success, false)
		assert.equal(res.body.statusCode, 422)
		assert.ok(typeof res.body.message === "string")
		assert.ok(res.body.message.length > 0)
	})

	test("POST /customer/register creates a customer without returning password", async () => {
		const customer = uniqueCustomer()
		createdEmails.push(customer.email)

		const res = await request(app).post("/api/customer/register").send(customer)

		assert.equal(res.status, 201)
		assert.equal(res.body.success, true)
		assert.equal(res.body.statusCode, 201)
		assert.equal(res.body.data.email, customer.email.toLowerCase())
		assert.equal(res.body.data.first_name, "Test")
		assert.equal(res.body.data.last_name, "User")
		assert.equal(res.body.data.password, undefined)
	})

	test("POST /customer/register returns 400 for duplicate email", async () => {
		const customer = uniqueCustomer()
		createdEmails.push(customer.email)

		await request(app).post("/api/customer/register").send(customer).expect(201)

		const res = await request(app).post("/api/customer/register").send(customer)

		assert.equal(res.status, 400)
		assert.equal(res.body.success, false)
		assert.equal(res.body.message, "Customer already registered")
	})

	test("POST /customer/login returns 422 for invalid email", async () => {
		const res = await request(app).post("/api/customer/login").send({
			email: "not-an-email",
			password: "TestPassw@rd1",
		})

		assert.equal(res.status, 422)
		assert.equal(res.body.success, false)
		assert.equal(res.body.statusCode, 422)
	})

	test("POST /customer/login returns 401 for wrong password", async () => {
		const customer = uniqueCustomer()
		createdEmails.push(customer.email)

		await request(app).post("/api/customer/register").send(customer).expect(201)

		const res = await request(app).post("/api/customer/login").send({
			email: customer.email,
			password: "WrongPassw@rd1",
		})

		assert.equal(res.status, 401)
		assert.equal(res.body.message, "Invalid credentials")
	})

	test("auth flow: register → login → protected route → logout", async () => {
		const customer = uniqueCustomer()
		createdEmails.push(customer.email)
		const agent = request.agent(app)

		await agent.post("/api/customer/register").send(customer).expect(201)

		const loginRes = await agent.post("/api/customer/login").send({
			email: customer.email,
			password: customer.password,
		})

		assert.equal(loginRes.status, 200)
		assert.equal(loginRes.body.success, true)
		assert.equal(loginRes.body.data.email, customer.email.toLowerCase())
		assert.equal(loginRes.body.data.password, undefined)
		assert.ok(
			loginRes.headers["set-cookie"]?.some((cookie: string) =>
				cookie.startsWith("access_token="),
			),
		)
		assert.ok(
			loginRes.headers["set-cookie"]?.some((cookie: string) =>
				cookie.startsWith("refresh_token="),
			),
		)

		const customerId = loginRes.body.data.customer_id
		const session = await redis.get(`session:${customerId}`)
		assert.ok(session)

		const protectedRes = await agent.get("/api/category")
		assert.equal(protectedRes.status, 200)
		assert.equal(protectedRes.body.success, true)
		assert.ok(Array.isArray(protectedRes.body.data))

		const logoutRes = await agent.post("/api/customer/logout")
		assert.equal(logoutRes.status, 200)
		assert.equal(logoutRes.body.message, "Customer logout")
		assert.equal(await redis.get(`session:${customerId}`), null)

		const unauthorizedRes = await request(app).get("/api/category")
		assert.equal(unauthorizedRes.status, 401)
		assert.equal(unauthorizedRes.body.message, "Unauthorized")
	})

	test("POST /customer/logout without cookies returns no-session message", async () => {
		const res = await request(app).post("/api/customer/logout")

		assert.equal(res.status, 200)
		assert.deepEqual(res.body, {
			success: true,
			statusCode: 200,
			message: "No Customer to logout",
		})
	})
})
