import { query, body } from "express-validator"

export const getAllCustomersValidator = [
  query("sort").toLowerCase(),
  query("order").toLowerCase(),
  query("filterBy").optional().toLowerCase(),
  query("filterval").optional(),
]

export const postCustomerValidator = [
  body("first_name")
    .notEmpty()
    .withMessage("Body 'first_name' can't be empty")
    .isString()
    .withMessage("Body 'first_name' must be a string"),
  body("last_name")
    .notEmpty()
    .withMessage("Body 'last_name' can't be empty")
    .isString()
    .withMessage("Body 'last_name' must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Body 'email' can't be empty")
    .isEmail()
    .withMessage("Body 'email' must have valid format")
    .toLowerCase(),
]

export const patchCustomerValidator = [
  body("first_name")
    .optional()
    .isString()
    .withMessage("Body 'first_name' must be a string"),
  body("last_name")
    .optional()
    .isString()
    .withMessage("Body 'last_name' must be a string"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Body 'email' must have valid format")
    .toLowerCase(),
]
