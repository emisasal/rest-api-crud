import type { NextFunction, Request, Response } from "express"
import errorHandler from "../utils/errorHandler"

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	next(errorHandler(404, `Route ${req.method} ${req.originalUrl} Not found`))
}

export default notFoundHandler
