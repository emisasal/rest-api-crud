import { Router } from "express"
import * as publisherController from "../controllers/publisher.controller"

const router = Router()

// '/publisher'
router.get("/", publisherController.getAllPublishers)
router.get("/:id") // Get publisher by id
router.post("/") // Create publisher
router.patch("/:id") // Modify publisher
router.delete("/:id") // Delete publisher

export default router
