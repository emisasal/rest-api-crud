import { Router } from "express"
import * as customerValidator from "../validators/customer.validators"
import * as customerController from "../controllers/customer.controller"
import validationError from "../middleware/validationError.middleware"

const router = Router()

// @route /customer
router.get(
  "/",
  customerValidator.getAllCustomersValidator,
  validationError,
  customerController.getAllCustomers
)
router.get("/:id", customerController.getCustomerById)
router.post(
  "/",
  customerValidator.postCustomerValidator,
  validationError,
  customerController.postCustomer
)
router.patch(
  "/:id",
  customerValidator.patchCustomerValidator,
  validationError,
  customerController.patchCustomerByid
)
router.delete("/:id", customerController.deleteCustomer)

export default router
