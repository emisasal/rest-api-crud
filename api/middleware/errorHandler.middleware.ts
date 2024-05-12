import { Request, Response, NextFunction } from "express"
import { Prisma } from "@prisma/client"
import CustomError from "../classes/CustomError"

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(err)
    const prismaErrorMessage = err.meta?.cause as string
    return res
      .status(400)
      .send({ success: false, statusCode: 400, message: prismaErrorMessage })
  }

  const statusCode = err.status || 500
  const message = err.message || "Internal Server Error"
  return res
    .status(statusCode)
    .send({ success: false, statusCode: statusCode, message: message })
}

export default globalErrorHandler
