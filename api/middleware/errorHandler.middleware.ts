import { Request, Response, NextFunction } from "express"
import CustomError from "../classes/CustomError"

// const errorHandler = (
//   err: CustomError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   res.status(err.status || 500).send({ error: err.message || "Unknown error" })
// }

// export default errorHandler

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500
  const message = err.message || "Internal Server Error"
  return res.status(statusCode).send({ error: message })
}

export default globalErrorHandler