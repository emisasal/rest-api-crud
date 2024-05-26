import { body, param, query } from "express-validator"

export const getAllAuthorsValidator = [
  query("sort").toLowerCase(),
  query("order").toLowerCase(),
  query("filterBy").optional().toLowerCase(),
]

export const postAuthorValidator = [
  body("first_name")
    .notEmpty()
    .withMessage("Body 'first_name' can't be empty")
    .isString()
    .withMessage("Body 'first_name' must be string"),
  body("last_name")
    .notEmpty()
    .withMessage("Body 'last_name' can't be empty")
    .isString()
    .withMessage("Body 'last_name' must be string"),
  body("bio").optional().isString().withMessage("Body 'bio' must be string"),
]

export const patchAuthorValidator = [
  body("first_name")
    .optional()
    .isString()
    .withMessage("Body 'first_name' can't be empty"),
  body("last_name")
    .optional()
    .isString()
    .withMessage("Body 'last_name' must be string"),
  body("bio").optional().isString().withMessage("Body 'bio' must be string"),
]
