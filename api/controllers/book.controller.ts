import { NextFunction, Request, Response } from "express"
import { prisma } from "../client"
import { validationResult } from "express-validator"
import errorHandler from "../utils/errorHandler"

const pageSize = 20

// Filter (with req.query)
// FullTextSearch postgres
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const count = await prisma.book.count()
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    const sort = req.query.sort || "title"
    const order = req.query.order || "asc"

    if (page > limit) {
      page = limit
    }

    let orderBy = { [String(sort)]: order }
    if (sort === "author") {
      orderBy = {
        author: {
          last_name: order,
        },
      }
    }
    if (sort === "genre") {
      orderBy = {
        genre: {
          name: order,
        },
      }
    }
    if (sort === "publisher") {
      orderBy = {
        publisher: {
          publisher_name: order,
        },
      }
    }

    const bookList = await prisma.book.findMany({
      take: pageSize,
      skip: page * pageSize,
      orderBy,
      include: {
        author: true,
        genre: true,
        publisher: true,
      },
    })
    return res.status(200).send({ books: bookList, page: page, limit: limit })
  } catch (error) {
    return res.status(400).send({ error })
  }
}

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const bookById = await prisma.book.findUnique({
      where: {
        book_id: Number(id),
      },
      include: {
        author: true,
        genre: true,
        publisher: true,
      },
    })
    if (!bookById) {
      return next(errorHandler(400, "Book not found"))
    }
    return res.status(200).send(bookById)
  } catch (error) {
    return next(errorHandler(400, `Error getting book: ${error}`))
  }
}

export const patchBookById = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = req.body
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const patchedBook = await prisma.book.update({
      where: {
        book_id: Number(id),
      },
      data: data,
    })
    return res.status(200).send(patchedBook)
  } catch (error) {
    return res
      .sendStatus(400)
      .send({ error: `Error patching book_id ${id}: ${error}` })
  }
}

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const deletedBook = await prisma.book.delete({
      where: {
        book_id: Number(id),
      },
    })
    return res.sendStatus(204)
  } catch (error) {
    return res
      .status(400)
      .send({ error: `Error deleting book_id ${id}: ${error}` })
  }
}
