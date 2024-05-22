import { Router } from "express"
import * as customerValidator from "../validators/customer.validators"
import * as customerController from "../controllers/customer.controller"

const router = Router()

// @route /customer
router.get("/", customerController.getAllCustomers)
router.get("/:id", customerController.getCustomerById)
router.post(
  "/",
  customerValidator.postCustomerValidator,
  customerController.postCustomer
)
router.patch(
  "/:id",
  customerValidator.patchCustomerValidator,
  customerController.patchCustomerByid
)
router.delete("/:id", customerController.deleteCustomer)

export default router
