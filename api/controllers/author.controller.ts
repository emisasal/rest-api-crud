import { NextFunction, Request, Response } from "express"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"

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
