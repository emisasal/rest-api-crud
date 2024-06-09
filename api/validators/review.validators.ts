import { query, body } from "express-validator"

export const getAllReviewsValidator = [
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
  query("book_id")
    .optional()
    .isNumeric()
    .withMessage("Query 'book_id' must be number"),
  query("customer_id")
    .optional()
    .isNumeric()
    .withMessage("Query 'customer_id' must be number"),
  query("rateMin")
    .optional()
    .isInt()
    .withMessage("Query 'rateMin' must be integer number"),
  query("rateMax")
    .optional()
    .isInt()
    .withMessage("Query 'rateMax' must be integer number"),
]

export const postReviewValidator = [
  body("book_id")
    .notEmpty()
    .withMessage("Body 'book_id' can't be empty")
    .isNumeric()
    .withMessage("Body 'book_id' must be number"),
  body("customer_id")
    .notEmpty()
    .withMessage("Body 'customer_id' can't be empty")
    .isNumeric()
    .withMessage("Body 'customer_id' must be number"),
  body("rating", "Rating must be a number")
    .notEmpty()
    .withMessage("Body 'rating' can't be empty")
    .isNumeric()
    .withMessage("Body 'rating' must be number")
    .isInt({ min: 1, max: 10 })
    .withMessage("Body 'rating' must be value between 1 and 10"),
  body("comment")
    .optional()
    .isString()
    .withMessage("Body 'comment' must be string"),
]
