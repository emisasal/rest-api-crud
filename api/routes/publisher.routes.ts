import { Router } from "express"
import * as publisherValidator from "../validators/publisher.validators"
import * as publisherController from "../controllers/publisher.controller"

const router = Router()

// @route /publisher
router.get(
  "/",
  publisherValidator.getAllPublishersValidator,
  publisherController.getAllPublishers
)
router.get("/:id", publisherController.getPublisherById)
router.post(
  "/",
  publisherValidator.postPublisherValidator,
  publisherController.postPublisher
)
router.patch(
  "/:id",
  publisherValidator.patchPublisherValidator,
  publisherController.patchPublisherById
)
router.delete("/:id", publisherController.deletePublisher)

export default router
