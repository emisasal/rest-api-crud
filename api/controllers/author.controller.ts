import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { validationResult } from "express-validator"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"

const pageSize = 20

// @desc Get list of Authors w/ pagination and filter
// @route GET /api/author?page={number}&sort={ first_name | last_name }&order={ asc | desc }&filterBy={string}
export const getAllAuthors = async (
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

    const sort = req.query.sort?.toString() || "last_name"
    const order = req.query.order?.toString() || "asc"
    const filterBy = req.query.filterBy?.toString() || ""

    const where: Prisma.AuthorWhereInput = {
      OR: [
        {
          last_name: {
            contains: filterBy,
            mode: "insensitive",
          },
        },
        {
          first_name: {
            contains: filterBy,
            mode: "insensitive",
          },
        },
      ],
    }

    const count = await prisma.author.count({ where })
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    if (page > limit) {
      page = limit
    }

    const authorsList = await prisma.author.findMany({
      where,
      orderBy: { [sort]: order },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!authorsList) {
      return next(errorHandler(400, "Error getting Authors"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: authorsList,
      count: count,
      page: page,
      limit: limit,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Get single Author by Id
// @route GET /api/author/:id
export const getAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)
    const authorById = await prisma.author.findUnique({
      where: {
        author_id: id,
      },
    })

    if (!authorById) {
      return next(errorHandler(400, "Author not found"))
    }

    return res
      .status(200)
      .send({ success: true, statusCode: 200, data: authorById })
  } catch (error) {
    return next(error)
  }
}

// @desc Create new Author
// @route POST /api/author
// @body {title: string, description: string, author_id: number, genre_id: number, publisher_id: number, price: number, publish_date: date, isbn: string}
export const postAuthor = async (
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

    const data = req.body
    data.first_name = capitalizeWords(data.first_name)
    data.last_name = capitalizeWords(data.last_name)
    data.bio = data.bio || null

    const findAuthor = await prisma.author.findFirst({
      where: {
        first_name: data.first_name,
        last_name: data.last_name,
      },
    })
    if (findAuthor) {
      return next(errorHandler(409, "Author already registred"))
    }

    const newAuthor = await prisma.author.create({
      data: data,
    })
    if (!newAuthor) {
      return next(errorHandler(400, "Error Creating Author"))
    }

    return res.status(201).send({
      success: true,
      statusCode: 201,
      data: newAuthor,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Modify Author by Id
// @route PATCH /api/author/:id
// @body {title: string, description: string, author_id: number, genre_id: number, publisher_id: number, price: number, publish_date: date, isbn: string}
export const patchAuthorById = async (
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
    if (data.first_name) {
      data.first_name = capitalizeWords(data.first_name)
    }
    if (data.last_name) {
      data.last_name = capitalizeWords(data.last_name)
    }

    const patchedAuthor = await prisma.author.update({
      where: {
        author_id: id,
      },
      data: data,
    })

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: patchedAuthor,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Remove Author
// @route DELETE /api/author/:id
export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)
    const deletedAuthor = await prisma.author.delete({
      where: {
        author_id: id,
      },
    })

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Author successfully deleted",
    })
  } catch (error) {
    return next(error)
  }
}
