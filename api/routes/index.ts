import { Router } from "express"

import book from "./book.routes"
import customer from "./customer.routes"
import review from "./review.routes"

const router = Router()

router.use("/book", book)
router.use("/customer", customer)
router.use("/review", review)

export default router
