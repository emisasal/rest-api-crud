import { body, param, query } from "express-validator"

export const getAllAuthorsValidator = [
  query("page").notEmpty().withMessage("Page can't be empty"),
  query("sort").notEmpty().withMessage("Sort can't be empty").toLowerCase(),
  query("order").notEmpty().withMessage("Order can't be empty").toLowerCase(),
  query("filterBy").optional().toLowerCase(),
]

export const postAuthorValidator = [
  body("first_name")
    .notEmpty()
    .withMessage("First name can't be empty")
    .isString()
    .withMessage("Name must be string"),
  body("last_name")
    .notEmpty()
    .withMessage("Last name can't be empty")
    .isString()
    .withMessage("Last name must be string"),
  body("bio").optional().isString().withMessage("Bio must be string"),
]

export const patchAuthorValidator = [
  param("id").notEmpty().withMessage("Id param can't be empty"),
  body("first_name").optional().isString().withMessage("Name must be string"),
  body("last_name")
    .optional()
    .isString()
    .withMessage("Last name must be string"),
  body("bio").optional().isString().withMessage("Bio must be string"),
]
