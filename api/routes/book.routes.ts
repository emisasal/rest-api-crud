import { Router } from "express"

import * as bookController from "../controllers/book.controller"

const router = Router()

// '/book'
router.get("/", bookController.getAllBooks)
router.get("/:id", bookController.getBookById)
router.patch("/:id") // Modify book
router.delete("/:id") // Delete book

export default router
