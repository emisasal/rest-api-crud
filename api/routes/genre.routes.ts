import { Router } from "express"
import * as genreValidator from "../validators/genre.validators"
import * as genreController from "../controllers/genre.controller"

const router = Router()

// '/genre'
router.get("/", genreController.getAllGenres)
router.get("/:id", genreController.getGenreById)
router.post("/", genreValidator.postGenreValidator, genreController.postGenre)
router.patch("/:id") // Modify genre
router.delete("/:id") // Delete genre

export default router
