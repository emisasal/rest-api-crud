import { Router } from "express"
import * as reviewController from "../controllers/review.controller"

const router = Router()

// @route /review
router.get("/", reviewController.getAllReviews)
router.get("/:id") // Get review by id
router.post("/") // Create review
router.patch("/:id") // Modify review
router.delete("/:id") // Delete review

export default router
