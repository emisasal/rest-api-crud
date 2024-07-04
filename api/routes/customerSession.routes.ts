import { Router } from "express"
import * as customerValidator from "../validators/customer.validators"
import * as customerSessionController from "../controllers/customerSession.controller"
import validationError from "../middleware/validationError.middleware"
import rateLimiter from "../middleware/rateLimiter.middleware"

const router = Router()

// @route /
router.post(
  "/customer/register",
  rateLimiter,
  customerValidator.postRegisterCustomerValidator,
  validationError,
  customerSessionController.postRegisterCustomer
)

router.post(
  "/customer/login",
  rateLimiter,
  customerValidator.postLoginCustomerValidator,
  validationError,
  customerSessionController.postLoginCustomer
)

router.post(
  "/customer/logout",
  rateLimiter,
  customerSessionController.postLogoutCustomer
)

export default router
