import assert from "node:assert/strict"
import type { Mock } from "node:test"

type MockFn = Mock<(...args: unknown[]) => unknown>

export const assertMockCalledTimes = (fn: MockFn, times: number) => {
	assert.equal(fn.mock.callCount(), times)
}

export const assertMockCalled = (fn: MockFn) => {
	assert.ok(fn.mock.callCount() > 0, "Expected mock to have been called")
}

export const assertMockLastCalledWith = (fn: MockFn, ...args: unknown[]) => {
	assertMockCalled(fn)
	const lastCall = fn.mock.calls[fn.mock.callCount() - 1]
	assert.deepEqual(lastCall.arguments, args)
}

export const assertMockLastCalledWithError = (
	fn: MockFn,
	expected: { message: string; status?: number },
) => {
	assertMockCalled(fn)
	const error = fn.mock.calls[fn.mock.callCount() - 1].arguments[0] as {
		message?: string
		status?: number
	}

	assert.equal(error.message, expected.message)
	if (expected.status !== undefined) {
		assert.equal(error.status, expected.status)
	}
}
