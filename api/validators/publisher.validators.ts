import { body } from "express-validator"

export const postPublisherValidator = [
  body("publisher_name", "Name must be a string").isString(),
  body("contact_name", "Contact name must be a string").optional().isString(),
  body("phone_number", "Phone number must be a string").isString(),
]

export const patchPublisherValidator = [
  body("publisher_name", "Name must be a string").optional().isString(),
  body("contact_name", "Contact name must be a string").optional().isString(),
  body("phone_number", "Phone number must be a string").optional().isString(),
]
