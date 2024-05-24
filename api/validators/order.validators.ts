import { body } from "express-validator"

export const postOrderValidator = [
  body("customer_id", "Customer Id must be a number").isNumeric(),
  body("books", "Books must be an array").isArray().notEmpty(),
//   body("*.book_id", "Book Id must be a number").notEmpty().isInt(),
//   body("*.quantity", "Quantity must be a number").notEmpty().isInt(),
]
