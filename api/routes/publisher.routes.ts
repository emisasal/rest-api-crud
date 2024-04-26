import { Router } from "express"

const router = Router()

// '/publisher'
router.get("/") // List all publishers
router.get("/:id") // Get publisher by id
router.post("/") // Create publisher
router.patch("/:id") // Modify publisher
router.delete("/:id") // Delete publisher

export default router
