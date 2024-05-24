import { Router } from "express"
import * as authorController from "../controllers/author.controller"
import * as authorValidator from "../validators/author.validators"

const router = Router()

// @route /author
router.get(
  "/",
  authorValidator.getAllAuthorsValidator,
  authorController.getAllAuthors
)
router.get("/:id", authorController.getAuthorById)
router.post(
  "/",
  authorValidator.postAuthorValidator,
  authorController.postAuthor
)
router.patch(
  "/:id",
  authorValidator.patchAuthorValidator,
  authorController.patchAuthorById
)
router.delete("/:id", authorController.deleteAuthor)

export default router
