import CustomError from "classes/CustomError"

const matchError = (status: number, message: string) => {
  const errorValidation = new Error() as CustomError
  errorValidation.message = message
  errorValidation.status = status

  return errorValidation
}

export default matchError
