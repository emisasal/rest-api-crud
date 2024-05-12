import { Router } from "express"
import * as authorController from "../controllers/author.controller"

const router = Router()

// '/author'
router.get("/", authorController.getAllAuthors)
router.get("/:id", authorController.getAuthorById)
router.post("/") // Create author
router.patch("/:id") // Modify author
router.delete("/:id") // Delete author

export default router
