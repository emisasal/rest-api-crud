import { Router } from "express"

const router = Router()

router.get("/") // List all customers
router.get("/:id") // Get customer by id
router.post("/") // Create (or find) customer
router.put("/:id") // Modify customer
router.delete("/:id") // Delete customer

export default router
