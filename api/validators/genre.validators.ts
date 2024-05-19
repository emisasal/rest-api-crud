import { body } from "express-validator"

export const postGenreValidator = [
  body("name", "Name must be a string").isString(),
  body("description", "Description must be a string").optional().isString(),
]

export const patchGenreValidator = [
  body("name", "Name must be a string").optional().isString(),
  body("description", "Description must be a string").optional().isString(),
]
