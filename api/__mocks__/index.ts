import type { Request, Response } from "express-serve-static-core"
import { mock } from "node:test"

type MockFn = ReturnType<typeof mock.fn>

const createMockResponse = () => {
	const response = {
		send: mock.fn(),
		status: mock.fn(),
		cookie: mock.fn(),
		clearCookie: mock.fn(),
		end: mock.fn(),
	}

	response.send.mock.mockImplementation(() => response)
	response.status.mock.mockImplementation(() => response)
	response.cookie.mock.mockImplementation(() => response)
	response.clearCookie.mock.mockImplementation(() => response)
	response.end.mock.mockImplementation(() => response)

	return response as unknown as Response & {
		send: MockFn
		status: MockFn
		cookie: MockFn
		clearCookie: MockFn
		end: MockFn
	}
}

export const mockRequest = {
	body: {},
	query: {},
	params: {},
	signedCookies: {},
} as unknown as Request

export const mockResponse = createMockResponse()

export const mockNext = mock.fn()

export const resetMocks = () => {
	mockRequest.body = {}
	mockRequest.query = {}
	mockRequest.params = {}
	mockRequest.signedCookies = {}

	mockNext.mock.resetCalls()
	mockResponse.send.mock.resetCalls()
	mockResponse.status.mock.resetCalls()
	mockResponse.cookie.mock.resetCalls()
	mockResponse.clearCookie.mock.resetCalls()
	mockResponse.end.mock.resetCalls()
}
