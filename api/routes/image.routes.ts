import { Router } from "express"

import * as imageController from "../controllers/image.controllers"

const router = Router()

// '/image'
router.get("/:id", imageController.getImageById) // Get author by id

export default router
