import { Router } from "express"

const router = Router()

router.get("/") // List all books
router.get("/:id") // Get book by id
router.post("/") // Create book
router.put("/:id") // Modify book
router.delete("/:id") // Delete book

export default router