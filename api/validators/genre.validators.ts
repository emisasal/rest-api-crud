import { body, query } from "express-validator"

export const getAllGenresValidator = [
  query("sort").toLowerCase(),
  query("order").toLowerCase(),
  query("filterBy").optional().toLowerCase(),
]

export const postGenreValidator = [
  body("name")
    .notEmpty()
    .withMessage("Body 'name' can't be empty")
    .isString()
    .withMessage("Body 'name' must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Body 'description' must be a string"),
]

export const patchGenreValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Body 'name' must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Body 'description' must be a string"),
]
