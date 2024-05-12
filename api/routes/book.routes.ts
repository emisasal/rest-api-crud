import { Router } from "express"
import * as bookController from "../controllers/book.controller"
import * as bookValidator from "../validators/book.validators"

const router = Router()

// '/book'
router.get("/", bookController.getAllBooks)
router.get("/:id", bookController.getBookById)
router.post("/", bookValidator.postBookValidator, bookController.postBook)
router.patch(
  "/:id",
  bookValidator.patchBookValidator,
  bookController.patchBookById
)
router.delete("/:id", bookController.deleteBook)

export default router
