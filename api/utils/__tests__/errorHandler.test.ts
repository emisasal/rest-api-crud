import errorHandler from "utils/errorHandler"

const statusCode = 400
const errorMessage = "Error message"

test("Returns error with params", () => {
  const newError = errorHandler(statusCode, errorMessage)

  expect(newError.status).toEqual(statusCode)
  expect(newError.message).toEqual(errorMessage)
})
