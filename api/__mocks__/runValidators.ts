import type { Request } from "express"
import {
	validationResult,
	type Result,
	type ValidationChain,
	type ValidationError,
} from "express-validator"

type RequestData = {
	body?: Record<string, unknown>
	query?: Record<string, unknown>
	params?: Record<string, unknown>
}

export const runValidators = async (
	validators: ValidationChain[],
	data: RequestData = {},
): Promise<Result<ValidationError>> => {
	const req = {
		body: data.body ?? {},
		query: data.query ?? {},
		params: data.params ?? {},
	} as unknown as Request

	for (const validator of validators) {
		await validator.run(req)
	}

	return validationResult(req)
}
