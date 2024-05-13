import { NextFunction, Request, Response } from "express"
import { prisma } from "../client"
import { validationResult } from "express-validator"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"

const pageSize = 20

// Filter (with req.query)
// FullTextSearch postgres

// @desc Get list of books
// @route GET /api/book
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await prisma.book.count()
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    const { sort = "title", order = "asc" } = req.query

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
    if (!bookList) {
      return next(errorHandler(409, "Error getting books"))
    }
    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: bookList,
      page: page,
      limit: limit,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Get single book
// @route GET /api/book/:id
export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const bookById = await prisma.book.findUnique({
      where: {
        book_id: +id,
      },
      include: {
        author: true,
        genre: true,
        publisher: true,
      },
    })
    if (!bookById) {
      return next(errorHandler(409, "Book not found"))
    }
    return res
      .status(200)
      .send({ success: true, statusCode: 200, data: bookById })
  } catch (error) {
    return next(error)
  }
}

// @desc Create new book
// @route POST /api/book
export const postBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg)
      return next(errorHandler(422, errorMessages.toString()))
    }

    const reqData = req.body
    const title = capitalizeWords(reqData.title)
    const data = { ...reqData, title }

    const findBookIsbn = await prisma.book.findUnique({
      where: {
        isbn: data.isbn,
      },
    })
    if (findBookIsbn) {
      return next(
        errorHandler(
          409,
          `Book already registred with id ${findBookIsbn.book_id}`
        )
      )
    }

    const newBook = await prisma.book.create({
      data: data,
    })
    return res
      .status(201)
      .send({ success: true, statusCode: 201, data: newBook })
  } catch (error) {
    return next(error)
  }
}

// @desc Modify book by Id
// @route PATCH /api/book/:id
export const patchBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((err) => err.msg)
        .toString()
      return next(errorHandler(422, errorMessages))
    }

    const { id } = req.params
    const reqData = req.body
    const title = capitalizeWords(reqData.title)
    const data = { ...reqData, title }

    const patchedBook = await prisma.book.update({
      where: {
        book_id: +id,
      },
      data: data,
    })
    return res
      .status(200)
      .send({ succes: true, statsuCode: 200, data: patchedBook })
  } catch (error) {
    return next(error)
  }
}

// @desc Delete single book by Id
// @route DELETE /api/book/:id
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const deletedBook = await prisma.book.delete({
      where: {
        book_id: +id,
      },
    })
    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: `Book Id ${id} Successfully Deleted `,
    })
  } catch (error) {
    return next(error)
  }
}
