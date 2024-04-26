import { Router } from "express"

import book from "./book.routes"
import author from "./author.routes"
import genre from "./genre.routes"
import publisher from "./publisher.routes"
import order from "./order.routes"
import orderDetail from "./orderDetail.routes"
import customer from "./customer.routes"
import review from "./review.routes"

const router = Router()

router.use("/book", book)
router.use("/author", author)
router.use("/genre", genre)
router.use("/publisher", publisher)
router.use("/order", order)
router.use("/orderDetail", orderDetail)
router.use("/customer", customer)
router.use("/review", review)

export default router
