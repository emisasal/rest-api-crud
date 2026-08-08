import { Router } from "express"
import * as customerSessionController from "../controllers/customerSession.controller"
import validationError from "../middleware/validationError.middleware"
import * as customerValidator from "../validators/customer.validators"
// import rateLimiterFlexible from "middleware/rateLimiterFlexible.middleware"
import rateLimiter from "../middleware/rateLimiter.middleware"

const router = Router()

// @route /
router.post(
	"/customer/register",
	customerValidator.postRegisterCustomerValidator,
	validationError,
	customerSessionController.postRegisterCustomer,
)

router.post(
	"/customer/login",
	rateLimiter,
	// rateLimiterFlexible,
	customerValidator.postLoginCustomerValidator,
	validationError,
	customerSessionController.postLoginCustomer,
)

router.post("/customer/logout", customerSessionController.postLogoutCustomer)

export default router
