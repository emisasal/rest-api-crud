import { Router } from "express"
import * as customerController from "../controllers/customer.controller"

const router = Router()

// '/customer'
router.get("/", customerController.getAllCustomers)
router.get("/:id") // Get customer by id
router.post("/") // Create (or find) customer
router.patch("/:id") // Modify customer
router.delete("/:id") // Delete customer

export default router
