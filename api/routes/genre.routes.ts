import { Router } from "express"

const router = Router()

// '/genre'
router.get("/") // List all genres
router.get("/:id") // Get genre by id
router.post("/") // Create genre
router.patch("/:id") // Modify genre
router.delete("/:id") // Delete genre

export default router