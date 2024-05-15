import { NextFunction, Request, Response } from "express"
import { prisma } from "../client"
import { validationResult } from "express-validator"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"

const pageSize = 20

// FullTextSearch postgres

// @desc Get list of books
// @route GET /api/book?page={number}&sort=${title || price || publish_date }&order={asc || desc}&filterkey={title || publish_date || isbn || author || genre || publisher}&filterval={string}
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      sort = "title",
      order = "asc",
      filterkey = "",
      filterval = "",
    } = req.query

    const count = await prisma.book.count()
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0

    if (page > limit) {
      page = limit
    }

    // const filterArray = filter.toString().split(",")

    // let whereObj = { where: {} }
    // if (filterkey && filterval) {
    //   whereObj.where = {
    //     [filterkey.toString()]: filterval.toString(),
    //   }
    // }

    const bookFilterHandler = (filterkey: string, filterval: string) => {
      if (filterkey === "author") {
        return {
          OR: [
            {
              author: {
                last_name: {
                  contains: filterval,
                },
              },
            },
            {
              author: {
                first_name: {
                  contains: filterval,
                },
              },
            },
          ],
        }
      }
      // if (filterkey === "genre") {
      //   return {
      //     genre: {
      //       name: {
      //         contains: filterval,
      //       },
      //     },
      //   }
      // }
      // if (filterkey === "publisher") {
      //   return {
      //     publisher: {
      //       publisher_name: {
      //         contains: filterval,
      //       },
      //     },
      //   }
      // }
      return {}
    }

    // Fix this function
    const where = bookFilterHandler(filterkey.toString(), filterval.toString())

    console.log("WWW", where)

    let orderBy = { [String(sort)]: order }
    // if (sort === "author") {
    //   orderBy = {
    //     author: {
    //       last_name: order,
    //     },
    //   }
    // }
    // if (sort === "genre") {
    //   orderBy = {
    //     genre: {
    //       name: order,
    //     },
    //   }
    // }
    // if (sort === "publisher") {
    //   orderBy = {
    //     publisher: {
    //       publisher_name: order,
    //     },
    //   }
    // }

    // const value = "title"

    const bookList = await prisma.book.findMany({
      where,
      // where: {
      //   ...(filterval
      //     ? {
      //         [filterkey.toString()]: {
      //           search: filterval,
      //         },
      //       }
      //     : {}),
      // },
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
