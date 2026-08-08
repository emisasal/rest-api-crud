import assert from "node:assert/strict"
import { after, afterEach, before, beforeEach, describe, test } from "node:test"
import {
	assertMockCalled,
	assertMockCalledTimes,
	assertMockLastCalledWith,
	assertMockLastCalledWithError,
} from "../../__mocks__/assertMocks"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import {
	createCustomer,
	registeredCustomer,
} from "../../__mocks__/customerMocks"
import {
	mockNext,
	mockRequest,
	mockResponse,
	resetMocks,
} from "../../__mocks__/index"
import { prisma } from "../../config/prismaClient"
import {
	postLoginCustomer,
	postLogoutCustomer,
	postRegisterCustomer,
} from "../customerSession.controller"

describe("customerSession controller", () => {
	before(async () => {
		resetMocks()
		mockRequest.body = registeredCustomer
		await postRegisterCustomer(mockRequest, mockResponse, mockNext)
	})

	beforeEach(async () => {
		resetMocks()
		await clearRedisCache()
	})

	afterEach(async () => {
		resetMocks()
		await postLogoutCustomer(mockRequest, mockResponse, mockNext)

		const newCustomerExists = await prisma.customer.findFirst({
			where: {
				email: "bob@dylan.com",
			},
		})
		if (newCustomerExists) {
			await prisma.customer.delete({
				where: {
					email: "bob@dylan.com",
				},
			})
		}
	})

	after(async () => {
		await prisma.customer.delete({
			where: {
				email: "tom@petty.com",
			},
		})
	})

	describe("postRegisterCustomer", () => {
		test("Returns error if data not validated", async () => {
			mockRequest.body = {}
			await postRegisterCustomer(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWithError(mockNext, {
				message: "Cannot read properties of undefined (reading 'replace')",
			})
		})

		test("Returns error 400 if customer exist", async () => {
			mockRequest.body = registeredCustomer
			await postRegisterCustomer(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWithError(mockNext, {
				message: "Customer already registered",
				status: 400,
			})
		})

		test("Registers new customer", async () => {
			mockRequest.body = createCustomer
			await postRegisterCustomer(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWith(mockResponse.status, 201)
			assertMockCalled(mockResponse.send)
		})
	})

	describe("postLoginCustomer", () => {
		test("Returns error if data not validated", async () => {
			mockRequest.body = { email: "notValidEmail", password: "09876543" }
			await postLoginCustomer(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWithError(mockNext, {
				message: "Invalid credentials",
				status: 401,
			})
		})

		test("Returns error 401 if Invalid Credentials", async () => {
			mockRequest.body = { email: "tom@petty.com", password: "09876543" }
			const isLoged = await postLoginCustomer(
				mockRequest,
				mockResponse,
				mockNext,
			)

			assert.equal(isLoged, undefined)
			assertMockLastCalledWithError(mockNext, {
				message: "Invalid credentials",
				status: 401,
			})
		})

		test("Login customer successfully", async () => {
			mockRequest.body = { email: "tom@petty.com", password: "testPassw@rd1" }
			await postLoginCustomer(mockRequest, mockResponse, mockNext)

			assertMockCalledTimes(mockResponse.cookie, 2)
			assertMockLastCalledWith(mockResponse.status, 200)
			assertMockCalled(mockResponse.send)
		})
	})

	describe("postLogoutCustomer", () => {
		test("Logout customer successfully", async () => {
			mockRequest.body = { email: "tom@petty.com", password: "testPassw@rd1" }
			await postLoginCustomer(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWith(mockResponse.status, 200)

			const accessToken = mockResponse.cookie.mock.calls[0]?.arguments[1]
			const refreshToken = mockResponse.cookie.mock.calls[1]?.arguments[1]

			mockNext.mock.resetCalls()
			mockResponse.send.mock.resetCalls()
			mockResponse.status.mock.resetCalls()
			mockResponse.cookie.mock.resetCalls()
			mockResponse.clearCookie.mock.resetCalls()
			mockResponse.end.mock.resetCalls()

			mockRequest.signedCookies = {
				access_token: accessToken,
				refresh_token: refreshToken,
			}

			await postLogoutCustomer(mockRequest, mockResponse, mockNext)

			assertMockCalledTimes(mockResponse.clearCookie, 2)
			assertMockLastCalledWith(mockResponse.status, 200)
			assertMockLastCalledWith(mockResponse.send, {
				success: true,
				statusCode: 200,
				message: "Customer logout",
			})
		})

		test("No customer to logout", async () => {
			await postLogoutCustomer(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWith(mockResponse.status, 200)
			assertMockLastCalledWith(mockResponse.send, {
				message: "No Customer to logout",
				statusCode: 200,
				success: true,
			})
		})
	})
})
