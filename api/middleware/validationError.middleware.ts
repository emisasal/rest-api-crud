import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import errorHandler from "../utils/errorHandler"

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .toString()
    return next(errorHandler(422, errorMessages))
  }
  return next()
}

export default validationError
