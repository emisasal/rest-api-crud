import { Router } from "express"

const router = Router()

// '/order'
router.get("/") // List all orders
router.get("/:id") // Get order by id
router.post("/") // Create order
router.put("/:id") // Modify order
router.delete("/:id") // Delete order

export default router
