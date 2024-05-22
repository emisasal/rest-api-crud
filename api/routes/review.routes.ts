import { Router } from "express"
import * as reviewValidator from "../validators/review.validators"
import * as reviewController from "../controllers/review.controller"

const router = Router()

// @route /review
router.get("/", reviewController.getAllReviews)
router.get("/:id", reviewController.getReviewById)
router.post(
  "/",
  reviewValidator.postReviewValidator,
  reviewController.postReview
)
router.delete("/:id", reviewController.deleteReview)

export default router
