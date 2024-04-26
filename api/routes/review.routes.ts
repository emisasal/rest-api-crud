import { Router } from "express"

const router = Router()

// '/review' //
router.get("/") // List all reviews
router.get("/:id") // Get review by id
router.post("/") // Create review
router.patch("/:id") // Modify review
router.delete("/:id") // Delete review

export default router
