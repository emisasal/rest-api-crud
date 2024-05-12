import { body } from "express-validator"

export const patchBookValidator = [
  body("title", "Title must be string").optional().isString(),
  body("description", "Description must be string").optional().isString(),
  body("price", "Price must be decimal").optional().isDecimal(),
  body("isbn", "Isbn must be a string").optional().isString(),
]
