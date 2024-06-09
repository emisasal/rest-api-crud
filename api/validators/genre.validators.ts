import { body, query } from "express-validator"

export const getAllGenresValidator = [
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

export const postGenreValidator = [
  body("name")
    .notEmpty()
    .withMessage("Body 'name' can't be empty")
    .isString()
    .withMessage("Body 'name' must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Body 'description' must be a string"),
]

export const patchGenreValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Body 'name' must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Body 'description' must be a string"),
]
