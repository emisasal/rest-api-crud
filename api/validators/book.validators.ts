import { body, query } from "express-validator"

export const getAllBooksValidator = [
  query("page")
    .notEmpty()
    .withMessage("Query 'page' can't be empty")
    .isInt()
    .withMessage("Query 'page' must be number"),
  query("sort")
    .notEmpty()
    .withMessage("Query 'sort' can't be empty")
    .isString()
    .withMessage("Query 'sort' must be string")
    .toLowerCase(),
  query("order")
    .notEmpty()
    .withMessage("Query 'order' can't be empty")
    .isString()
    .withMessage("Query 'order' must be string")
    .toLowerCase(),
  query("title")
    .optional()
    .isString()
    .withMessage("Query 'title' must be string"),
  query("author")
    .optional()
    .isString()
    .withMessage("Query 'author' must be string"),
  query("genre")
    .optional()
    .isString()
    .withMessage("Query 'genre' must be string"),
  query("publisher")
    .optional()
    .isString()
    .withMessage("Query 'publisher' must be string"),
  query("isbn").optional(),
  query("dateStart")
    .optional()
    .isDate()
    .withMessage("Query 'dateStart' must be yyyy-mm-dd")
    .custom((date, { req }) => {
      const dateStart = new Date(date)
      const dateEnd = new Date(req.query?.dateEnd)
      if (dateStart && !dateEnd) {
        throw new Error("Query 'dateEnd' can't be empty")
      }
      return true
    })
    .toDate(),
  query("dateEnd")
    .optional()
    .isDate()
    .withMessage("Query 'dateEnd' must be yyyy-mm-dd")
    .custom((date, { req }) => {
      const dateEnd = new Date(date)
      const dateStart = new Date(req.query?.dateStart)
      if (dateEnd < dateStart) {
        throw new Error("Query 'dateEnd' must be greater than dateStart")
      }
      return true
    })
    .toDate(),
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
