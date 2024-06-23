import { body, query } from "express-validator"

export const getAllOrdersValidator = [
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
  query("customer")
    .optional()
    .isInt()
    .withMessage("Query 'customer' must be number"),
  query("dateStart").optional().isDate(),
  query("dateEnd").optional().isDate(),
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
