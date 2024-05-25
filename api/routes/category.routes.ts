import { Router } from "express"
import * as categoryController from "../controllers/category.controller"

const router = Router()

// @route /category
router.get("/", categoryController.getModels)
router.get("/:name", categoryController.getCategory)

export default router
