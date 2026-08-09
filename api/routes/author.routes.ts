import { Router } from "express"
import * as authorController from "../controllers/author.controller"
import validationError from "../middleware/validationError.middleware"
import * as authorValidator from "../validators/author.validators"

const router = Router()

// @route /author
router.get(
	"/",
	authorValidator.getAllAuthorsValidator,
	validationError,
	authorController.getAllAuthors,
)
router.get("/:id", authorController.getAuthorById)
router.post(
	"/",
	authorValidator.postAuthorValidator,
	validationError,
	authorController.postAuthor,
)
router.patch(
	"/:id",
	authorValidator.patchAuthorValidator,
	validationError,
	authorController.patchAuthorById,
)
router.delete("/:id", authorController.deleteAuthor)

export default router
