import { body } from "express-validator"

export const postBookValidator = [
  body("title", "Title must be string").isString(),
  body("description", "Description must be string").isString(),
  body("author_id", "author_id must be number").isNumeric(),
  body("genre_id", "genre_id must be number").isNumeric(),
  body("publisher_id", "publisher_id must be number").isNumeric(),
  body("price", "Price must be decimal").isDecimal(),
  body("publish_date", "publish_date must be date").isISO8601(),
  body("isbn", "Isbn must be a string").isString(),
]

export const patchBookValidator = [
  body("title", "Title must be string").optional().isString(),
  body("description", "Description must be string").optional().isString(),
  body("price", "Price must be decimal").optional().isDecimal(),
  body("isbn", "Isbn must be a string").optional().isString(),
]
