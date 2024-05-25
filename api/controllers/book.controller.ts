import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { validationResult } from "express-validator"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"

const pageSize = 20

// @desc Get list of books
// @route GET /api/book?page={number}&sort=${ title | price | publish_date }&order={ asc | desc }&filterkey={ isbn | author | genre | publisher }&filterval={string}
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort = req.query.sort?.toString() || "title"
    const order = req.query.order?.toString() || "asc"
    const filterBy = req.query.filterBy?.toString() || ""
    const filterval = req.query.filterval?.toString() || ""

    const bookFilterHandler: (
      filterBy: string,
      filterval: string
    ) => Prisma.BookWhereInput = (filterBy, filterval) => {
      if (filterBy === "author") {
        return {
          OR: [
            {
              author: {
                last_name: {
                  contains: filterval,
                  mode: "insensitive",
                },
              },
            },
            {
              author: {
                first_name: {
                  contains: filterval,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      }
      if (filterBy === "genre") {
        return {
          genre: {
            name: {
              contains: filterval,
              mode: "insensitive",
            },
          },
        }
      }
      if (filterBy === "publisher") {
        return {
          publisher: {
            publisher_name: {
              contains: filterval,
              mode: "insensitive",
            },
          },
        }
      }
      if (filterBy === "isbn") {
        return {
          isbn: { contains: filterval, mode: "insensitive" },
        }
      }
      return {}
    }

    const where = bookFilterHandler(filterBy, filterval)

    const count = await prisma.book.count({
      where,
    })
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page)
    if (page > limit) {
      page = limit
    }

    const bookList = await prisma.book.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      include: {
        author: true,
        genre: true,
        publisher: true,
      },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!bookList) {
      return next(errorHandler(409, "Error getting books"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: bookList,
      count: count,
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
    const id = Number(req.params.id)
    const bookById = await prisma.book.findUnique({
      where: {
        book_id: id,
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

// @desc Create new Book
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

// @desc Modify Book by Id
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

    const id = Number(req.params.id)
    const data = req.body
    if (data.title) {
      data.title = capitalizeWords(data.title)
    }

    const patchedBook = await prisma.book.update({
      where: {
        book_id: id,
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
    const id = Number(req.params.id)
    const deletedBook = await prisma.book.delete({
      where: {
        book_id: id,
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
