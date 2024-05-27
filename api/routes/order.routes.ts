import { Router } from "express"
import * as orderValidator from "../validators/order.validators"
import validationError from "../middleware/validationError.middleware"
import * as orderController from "../controllers/order.controller"

const router = Router()

// @route /order
router.get(
  "/",
  orderValidator.getAllOrdersValidator,
  validationError,
  orderController.getAllOrders
)
router.get("/:id", orderController.getOrderById)
router.post(
  "/",
  orderValidator.postOrderValidator,
  validationError,
  orderController.postOrder
)
// router.patch("/:id") // Modify order
router.delete("/:id", orderController.deleteOrderById)

export default router
