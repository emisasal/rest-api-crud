import { Router } from "express"
import * as orderController from "../controllers/order.controller"

const router = Router()

// @route /order
router.get("/", orderController.getAllOrders)
router.get("/:id") // Get order by id
router.post("/") // Create order
router.patch("/:id") // Modify order
router.delete("/:id") // Delete order

export default router
