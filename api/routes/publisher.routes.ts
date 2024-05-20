import { Router } from "express"
import * as publisherValidator from "../validators/publisher.validators"
import * as publisherController from "../controllers/publisher.controller"

const router = Router()

// '/publisher'
router.get("/", publisherController.getAllPublishers)
router.get("/:id", publisherController.getPublisherById)
router.post(
  "/",
  publisherValidator.postPublisherValidator,
  publisherController.postPublisher
)
router.patch("/:id")
router.delete("/:id") // Delete publisher

export default router
