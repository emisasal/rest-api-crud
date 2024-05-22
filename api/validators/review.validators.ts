import { body } from "express-validator"

export const postReviewValidator = [
  body("book_id", "Book Id must be a number").isNumeric(),
  body("customer_id", "Customer Id must be a number").isNumeric(),
  body("rating", "Rating must be a number")
    .isNumeric()
    .isInt({ min: 1, max: 10 }),
  body("comment", "Comment must be string").optional().isString(),
]
