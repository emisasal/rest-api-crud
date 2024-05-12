import { body } from "express-validator"

export const postAuthorValidator = [
  body("first_name", "Name must be string").isString(),
  body("last_name", "Last name must be string").isString(),
  body("bio", "Bio must be string").optional().isString(),
]
