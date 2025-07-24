import { Router } from "express"

const router = Router()

// @route /orderdetail
router.get("/", (req, res) => res.send("List order details"))
router.get("/:id", (req, res) => res.send(`Get order detail ${req.params.id}`))
router.post("/", (req, res) => res.send("Create order detail"))
router.patch("/:id", (req, res) => res.send(`Update order detail ${req.params.id}`))
router.delete("/:id", (req, res) => res.send(`Delete order detail ${req.params.id}`))

export default router
