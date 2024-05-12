import { Router } from "express"
import * as authorController from "../controllers/author.controller"
import * as authorValidator from "../validators/author.validators"

const router = Router()

// '/author'
router.get("/", authorController.getAllAuthors)
router.get("/:id", authorController.getAuthorById)
router.post(
  "/",
  authorValidator.postAuthorValidator,
  authorController.postAuthor
)
router.patch("/:id") // Modify author
router.delete("/:id") // Delete author

export default router
