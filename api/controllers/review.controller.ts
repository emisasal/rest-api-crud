import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"

const pageSize = 20

// @desc Get all the Reviews w/ pagination and filter
// @route GET /api/review?page={number}&sort={ review_date | rating }&order={ asc | desc }&filterkey={ book_id | customer_id | rating }&filterval={ number }
export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort = req.query.sort?.toString().toLowerCase() || "review_date"
    const order = req.query.order?.toString().toLowerCase() || "desc"
    const filterkey = req.query.filterkey?.toString() || ""
    const filterval = Number(req.query.filterval) || 0

    const where: Prisma.ReviewWhereInput = filterkey
      ? { [filterkey]: filterval }
      : {}

    const count = await prisma.review.count({ where })
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    if (page > limit) {
      page = limit
    }

    const reviewList = await prisma.review.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!reviewList) {
      return next(errorHandler(409, "Error getting Reviews list"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: reviewList,
      count: count,
      page: page,
      limit: limit,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc
// @route

// @desc
// @route

// @desc
// @route

// @desc
// @route

// @desc
// @route
