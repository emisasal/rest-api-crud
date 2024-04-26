import { Router } from "express"

const router = Router()

// '/customer' //
router.get("/") // List all customers
router.get("/:id") // Get customer by id
router.post("/") // Create (or find) customer
router.patch("/:id") // Modify customer
router.delete("/:id") // Delete customer

export default router
