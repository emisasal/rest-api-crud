import { Router } from "express"
import * as customerValidator from "../validators/customer.validators"
import * as customerController from "../controllers/customer.controller"

const router = Router()

// '/customer'
router.get("/", customerController.getAllCustomers)
router.get("/:id", customerController.getCustomerById)
router.post(
  "/",
  customerValidator.postCustomerValidator,
  customerController.postCustomer
)
router.patch("/:id") // Modify customer
router.delete("/:id") // Delete customer

export default router
