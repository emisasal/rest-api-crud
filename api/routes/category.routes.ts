import { Router } from "express"
import * as categoryController from "../controllers/category.controller"

const router = Router()

router.get("/", categoryController.getModels)
router.get("/model", categoryController.getCategory)

export default router
