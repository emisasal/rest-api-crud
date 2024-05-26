import { Router } from "express"
import * as genreValidator from "../validators/genre.validators"
import validationError from "../middleware/validationError.middleware"
import * as genreController from "../controllers/genre.controller"

const router = Router()

// @route /genre
router.get(
  "/",
  genreValidator.getAllGenresValidator,
  validationError,
  genreController.getAllGenres
)
router.get("/:id", genreController.getGenreById)
router.post(
  "/",
  genreValidator.postGenreValidator,
  validationError,
  genreController.postGenre
)
router.patch(
  "/:id",
  genreValidator.patchGenreValidator,
  validationError,
  genreController.patchGenreById
)
router.delete("/:id", genreController.deleteGenre)

export default router
