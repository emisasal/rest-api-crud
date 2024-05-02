import { Router } from "express"

import * as bookController from "../controllers/book.controller"

const router = Router()

// '/book'
router.get("/", bookController.getAllBooks)
router.get("/:id", bookController.getBookById)
router.post("/:id")
router.patch("/:id", bookController.patchBookById)
router.delete("/:id", bookController.deleteBook)

export default router
