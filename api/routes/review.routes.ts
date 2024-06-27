import { Router } from "express"
import * as reviewValidator from "../validators/review.validators"
import * as reviewController from "../controllers/review.controller"
import validationError from "../middleware/validationError.middleware"

const router = Router()

// @route /review
router.get("/", reviewController.getAllReviews)
router.get("/:id", reviewController.getReviewById)
router.post(
  "/",
  reviewValidator.postReviewValidator,
  validationError,
  reviewController.postReview
)
router.delete("/:id", reviewController.deleteReview)

export default router
