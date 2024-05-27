import { body, query } from "express-validator"

export const getAllBooksValidator = [
  query("sort").toLowerCase(),
  query("order").toLowerCase(),
  query("filterBy").optional().toLowerCase(),
  query("filterval").optional().toLowerCase(),
]

export const postBookValidator = [
  body("title")
    .notEmpty()
    .withMessage("Body 'title' can't be empty")
    .isString()
    .withMessage("Body 'title' must be string"),
  body("description")
    .notEmpty()
    .withMessage("Body 'description' can't be empty")
    .isString()
    .withMessage("Body 'description' must be string"),
  body("author_id")
    .notEmpty()
    .withMessage("Body 'author_id' can't be empty")
    .isNumeric()
    .withMessage("Body 'author_id' must be number"),
  body("genre_id")
    .notEmpty()
    .withMessage("Body 'genre_id' can't be empty")
    .isNumeric()
    .withMessage("Body 'genre_id' must be number"),
  body("publisher_id")
    .notEmpty()
    .withMessage("Body 'publisher_id' can't be empty")
    .isNumeric()
    .withMessage("Body 'publisher_id' must be number"),
  body("price")
    .notEmpty()
    .withMessage("Body 'price' can't be empty")
    .isDecimal()
    .withMessage("Body 'price' must be decimal"),
  body("publish_date")
    .notEmpty()
    .withMessage("Body 'publish_date' can't be empty")
    .isISO8601()
    .withMessage("Body 'publish_date' must be date"),
  body("isbn")
    .notEmpty()
    .withMessage("Body 'isbn' can't be empty")
    .isString()
    .withMessage("Body 'isbn' must be string")
    .toUpperCase(),
]

export const patchBookValidator = [
  body("title")
    .optional()
    .isString()
    .withMessage("Body 'title' must be string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Body 'description' must be string"),
  body("price")
    .optional()
    .isDecimal()
    .withMessage("Body 'price' must be decimal"),
  body("isbn")
    .optional()
    .isString()
    .withMessage("Body 'isbn' must be string")
    .toUpperCase(),
]
