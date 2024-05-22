import { body } from "express-validator"

export const postCustomerValidator = [
  body("first_name", "First name must be a string").isString(),
  body("last_name", "Last name must be a string").isString(),
  body("email", "Email must have valid format").isEmail(),
]

export const patchCustomerValidator = [
  body("first_name", "First name must be a string").optional().isString(),
  body("last_name", "Last name must be a string").optional().isString(),
  body("email", "Email must have valid format").optional().isEmail(),
]
