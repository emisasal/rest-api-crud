import { Router } from "express"
import * as orderValidator from "../validators/order.validators"
import * as orderController from "../controllers/order.controller"

const router = Router()

// @route /order
router.get("/", orderController.getAllOrders)
router.get("/:id", orderController.getOrderById)
router.post("/", orderValidator.postOrderValidator, orderController.postOrder)
router.patch("/:id") // Modify order
router.delete("/:id") // Delete order

export default router
