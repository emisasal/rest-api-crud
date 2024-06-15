import { query, body } from "express-validator"

export const getAllCustomersValidator = [
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
  query("name")
    .optional()
    .isString()
    .withMessage("Query 'name' must be string"),
  query("email")
    .optional()
    .isString()
    .withMessage("Query 'email' must be string"),
]

export const postCustomerValidator = [
  body("first_name")
    .notEmpty()
    .withMessage("Body 'first_name' can't be empty")
    .isString()
    .withMessage("Body 'first_name' must be a string"),
  body("last_name")
    .notEmpty()
    .withMessage("Body 'last_name' can't be empty")
    .isString()
    .withMessage("Body 'last_name' must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Body 'email' can't be empty")
    .isEmail()
    .withMessage("Body 'email' must have valid format")
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Body 'password' can't be empty")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      // pointsPerUnique: 1,
      // pointsPerRepeat: 0.5,
      // pointsForContainingLower: 10,
      // pointsForContainingUpper: 10,
      // pointsForContainingNumber: 10,
      // pointsForContainingSymbol: 10,
    }),
]

export const patchCustomerValidator = [
  body("first_name")
    .optional()
    .isString()
    .withMessage("Body 'first_name' must be a string"),
  body("last_name")
    .optional()
    .isString()
    .withMessage("Body 'last_name' must be a string"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Body 'email' must have valid format")
    .toLowerCase(),
]
