import { Router } from "express"

const router = Router()

// '/orderdetail'
router.get("/") // List all order details
router.get("/:id") // Get order detail by id
router.post("/") // Create order detail
router.patch("/:id") // Modify order detail
router.delete("/:id") // Delete order detail

export default router
