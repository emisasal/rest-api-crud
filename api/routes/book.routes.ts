import { Router } from "express"
import * as bookValidator from "../validators/book.validators"
import validationError from "../middleware/validationError.middleware"
import * as bookController from "../controllers/book.controller"

// import { openApi } from "docs/openapi.config"
// import * as bookDocs from "../docs/book.docs"

const router = Router()

// @route /book
router.get(
  "/",
  bookValidator.getAllBooksValidator,
  validationError,
  bookController.getAllBooks
)
router.get("/:id", bookController.getBookById)
router.post(
  "/",
  bookValidator.postBookValidator,
  validationError,
  bookController.postBook
)
router.patch(
  "/:id",
  bookValidator.patchBookValidator,
  validationError,
  bookController.patchBookById
)
router.delete("/:id", bookController.deleteBook)

export default router