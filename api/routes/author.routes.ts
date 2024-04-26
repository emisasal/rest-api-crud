import { Router } from "express"

const router = Router()

// '/author' //
router.get("/") // List all authors
router.get("/:id") // Get author by id
router.post("/") // Create author
router.put("/:id") // Modify author
router.delete("/:id") // Delete author

export default router