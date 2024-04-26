import { Router } from "express"

const router = Router()

// '/book' //
router.get("/") // List all books
router.get("/:id") // Get book by id
router.post("/") // Create book
router.patch("/:id") // Modify book
router.delete("/:id") // Delete book

export default router
