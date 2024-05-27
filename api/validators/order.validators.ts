import { body, query } from "express-validator"

export const getAllOrdersValidator = [
  query("sort").toLowerCase(),
  query("order").toLowerCase(),
  query("customer").optional(),
  query("dateinit").optional(),
  query("dateend").optional(),
]

export const postOrderValidator = [
  body("customer_id")
    .notEmpty()
    .withMessage("Body 'customer_id' can't be empty")
    .isNumeric()
    .withMessage("Body 'customer_id' must be number"),
  body("books")
    .notEmpty()
    .withMessage("Body 'books' can't be empty")
    .isArray()
    .withMessage("Body 'books' must be an array"),
  body("books.*.book_id")
    .notEmpty()
    .withMessage("Body 'book_id' can't be empty")
    .isInt()
    .withMessage("Body 'book_id' must be number"),
  body("books.*.quantity")
    .notEmpty()
    .withMessage("Body 'quantity' can't be empty")
    .isInt()
    .withMessage("Body 'quantity' must be number"),
]
