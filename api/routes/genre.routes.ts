import { Router } from "express"
import * as genreController from "../controllers/genre.controller"

const router = Router()

// '/genre'
router.get("/", genreController.getAllGenres)
router.get("/:id") // Get genre by id
router.post("/") // Create genre
router.patch("/:id") // Modify genre
router.delete("/:id") // Delete genre

export default router