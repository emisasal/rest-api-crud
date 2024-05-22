import { Router } from "express"

import * as imageController from "../controllers/image.controllers"

const router = Router()

// @route /image
router.get("/:id", imageController.getImageById)

export default router
