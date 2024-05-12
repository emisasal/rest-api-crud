import CustomError from "../classes/CustomError"

const errorHandler = (statusCode: number, message: string) => {
  const error = new Error() as CustomError
  error.status = statusCode
  error.message = message
  return error
}

export default errorHandler
