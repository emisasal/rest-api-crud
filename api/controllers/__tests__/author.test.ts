import { after, before, beforeEach, describe, test } from "node:test"
import {
	assertMockCalled,
	assertMockLastCalledWith,
	assertMockLastCalledWithError,
} from "../../__mocks__/assertMocks"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import { registeredCustomer } from "../../__mocks__/customerMocks"
import {
	mockNext,
	mockRequest,
	mockResponse,
	resetMocks,
} from "../../__mocks__/index"
import { prisma } from "../../config/prismaClient"
import { getAllAuthors, getAuthorById } from "../author.controller"
import {
	postLoginCustomer,
	postRegisterCustomer,
} from "../customerSession.controller"

describe("Author controller", () => {
	before(async () => {
		resetMocks()
		mockRequest.body = registeredCustomer
		await postRegisterCustomer(mockRequest, mockResponse, mockNext)

		mockRequest.body = { email: "tom@petty.com", password: "testPassw@rd1" }
		await postLoginCustomer(mockRequest, mockResponse, mockNext)
	})

	beforeEach(async () => {
		resetMocks()
		await clearRedisCache()
	})

	after(async () => {
		await prisma.customer.delete({
			where: {
				email: "tom@petty.com",
			},
		})
	})

	describe("getAllAuthors", () => {
		test.skip("Returns error 422 if data not validated", async () => {
			await getAllAuthors(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWithError(mockNext, {
				message: "Cannot read properties of undefined (reading 'page')",
				status: 422,
			})
		})

		test.skip("Returns Authors list", async () => {
			mockRequest.query = { page: "0" }
			await getAllAuthors(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWith(mockResponse.status, 200)
			assertMockCalled(mockResponse.send)
		})
	})

	describe("getAuthorById", () => {
		test.skip("Returns error 400 if Author not found", async () => {
			mockRequest.params = { id: "10500" }

			await getAuthorById(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWithError(mockNext, {
				message: "Author not found",
				status: 400,
			})
		})

		test.skip("Returns Author by Id param", async () => {
			mockRequest.params = { id: "1" }

			await getAuthorById(mockRequest, mockResponse, mockNext)

			assertMockLastCalledWith(mockResponse.status, 200)
			assertMockCalled(mockResponse.send)
		})
	})

	describe("postAuthor", () => {})

	describe("patchAuthorById", () => {})

	describe("deleteAuthor", () => {})
})
