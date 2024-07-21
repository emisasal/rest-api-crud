import type { Request, Response, NextFunction } from "express"
import errorHandler from "../utils/errorHandler"

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(errorHandler(404, `Route ${req.method} ${req.originalUrl} Not found`))
}

export default notFoundHandler
