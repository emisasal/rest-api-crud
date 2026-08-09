import type { NextFunction, Request, Response } from "express"
import { access } from "node:fs/promises"
import path from "node:path"
import errorHandler from "../utils/errorHandler"

export const getImageById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params
		const imagePath = path.resolve("bookCovers", `${id}.jpg`)

		try {
			await access(imagePath)
		} catch {
			return next(errorHandler(422, `Unable to get image ${id}.jpg`))
		}

		return res.status(200).sendFile(imagePath)
	} catch (error) {
		return next(error)
	}
}
