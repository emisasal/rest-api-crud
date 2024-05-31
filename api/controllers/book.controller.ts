import { NextFunction, Request, Response } from "express"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"
import paginationHandler from "../utils/paginationHandler"

const pageSize = 20

// @desc Get list of books
// @route GET /api/book?page={number}&sort=${ title | price | publish_date }&order={ asc | desc }&title={string}&author={string}&genre={string}&publisher={string}&isbn={string}&dateStart={yyyy-mm-dd}&dateEnd={yyyy-mm-dd}
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort = req.query.sort?.toString() || "title"
    const order = req.query.order?.toString() || "asc"
    const title = req.query.title?.toString()
    const author = req.query.author?.toString()
    const genre = req.query.genre?.toString()
    const publisher = req.query.publisher?.toString()
    const isbn = req.query.isbn?.toString()
    const dateStart = req.query.dateStart
    const dateEnd = req.query.dateEnd

    let where = {}
    if (title) {
      where = { ...where, title: { contains: title, mode: "insensitive" } }
    }
    if (author) {
      where = {
        ...where,
        OR: [
          {
            author: {
              last_name: {
                contains: author,
                mode: "insensitive",
              },
            },
          },
          {
            author: {
              first_name: {
                contains: author,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    }
    if (genre) {
      where = {
        ...where,
        genre: {
          name: {
            contains: genre,
            mode: "insensitive",
          },
        },
      }
    }
    if (publisher) {
      where = {
        ...where,
        publisher: {
          publisher_name: {
            contains: publisher,
            mode: "insensitive",
          },
        },
      }
    }
    if (isbn) {
      where = { ...where, isbn: { contains: isbn, mode: "insensitive" } }
    }
    if (dateStart && dateEnd) {
      where = {
        ...where,
        publish_date: {
          gte: dateStart,
          lte: dateEnd,
        },
      }
    }

    const count = await prisma.book.count({
      where,
    })
    const { limit, page } = paginationHandler({
      count,
      pageSize,
      page: Number(req.query.page),
    })

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
