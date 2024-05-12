import { NextFunction, Request, Response } from "express"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"
import { validationResult } from "express-validator"

const pageSize = 20

// FulltextSearch filter
export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await prisma.author.count()
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    const { sort = "last_name", order = "asc" } = req.query

    if (page > limit) {
      page = limit
    }

    const authorsList = await prisma.author.findMany({
      take: pageSize,
      skip: page * pageSize,
      orderBy: { [String(sort)]: order },
    })
    if (!authorsList) {
      return next(errorHandler(400, "Error getting Authors"))
    }
    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: authorsList,
      page: page,
      limit: limit,
    })
  } catch (error) {
    next(error)
  }
}

export const getAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const authorById = await prisma.author.findUnique({
      where: {
        author_id: +id,
      },
    })
    if (!authorById) {
      return next(errorHandler(400, "Author not found"))
    }
    return res
      .status(200)
      .send({ success: true, statusCode: 200, data: authorById })
  } catch (error) {
    next(error)
  }
}

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

    const reqData = req.body
    const first_name = capitalizeWords(reqData.first_name)
    const last_name = capitalizeWords(reqData.last_name)
    const bio = reqData.bio || null
    const data = {
      first_name,
      last_name,
      bio,
    }

    const findAuthor = await prisma.author.findFirst({
      where: {
        first_name,
        last_name,
      },
    })
    if (findAuthor) {
      return next(errorHandler(400, "Author already registred"))
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
    next(error)
  }
}