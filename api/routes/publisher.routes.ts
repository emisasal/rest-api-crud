import { Router } from "express"
import * as publisherValidator from "../validators/publisher.validators"
import * as publisherController from "../controllers/publisher.controller"
import validationError from "middleware/validationError.middleware"

const router = Router()

// @route /publisher
router.get(
  "/",
  publisherValidator.getAllPublishersValidator,
  validationError,
  publisherController.getAllPublishers
)
router.get("/:id", publisherController.getPublisherById)
router.post(
  "/",
  publisherValidator.postPublisherValidator,
  validationError,
  publisherController.postPublisher
)
router.patch(
  "/:id",
  publisherValidator.patchPublisherValidator,
  validationError,
  publisherController.patchPublisherById
)
router.delete("/:id", publisherController.deletePublisher)

export default router
