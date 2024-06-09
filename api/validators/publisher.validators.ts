import { query, body } from "express-validator"

export const getAllPublishersValidator = [
  query("page")
    .notEmpty()
    .withMessage("Query 'page' can't be empty")
    .isInt()
    .withMessage("Query 'page' must be number"),
  query("order")
    .notEmpty()
    .withMessage("Query 'order' can't be empty")
    .isString()
    .withMessage("Query 'order' must be string")
    .toLowerCase(),
  query("name")
    .optional()
    .isString()
    .withMessage("Query 'name' must be string"),
]

export const postPublisherValidator = [
  body("publisher_name")
    .notEmpty()
    .withMessage("Body 'publisher_name' can't be empty")
    .isString()
    .withMessage("Body 'publisher_name' must be a string"),
  body("contact_name")
    .optional()
    .isString()
    .withMessage("Body 'contact_name' must be a string"),
  body("phone_number")
    .notEmpty()
    .withMessage("Body 'phone_number' can't be empty")
    .isString()
    .withMessage("Body 'phone_number' must be a string"),
]

export const patchPublisherValidator = [
  body("publisher_name")
    .optional()
    .isString()
    .withMessage("Body 'publisher_name' must be a string"),
  body("contact_name")
    .optional()
    .isString()
    .withMessage("Body 'contact_name' must be a string"),
  body("phone_number")
    .optional()
    .isString()
    .withMessage("Body 'phone_number' must be a string"),
]
