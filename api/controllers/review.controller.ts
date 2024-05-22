import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"
import { validationResult } from "express-validator"

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

// @desc Get Review by Id
// @route GET /api/review/:id
export const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    const reviewById = await prisma.review.findUnique({
      where: {
        review_id: id,
      },
      include: {
        book: true,
        customer: true,
      },
    })

    if (!reviewById) {
      return next(errorHandler(400, "Review not found"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: reviewById,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Create new Review
// @route POST /api/review
// @body {book_id: number, customer_id: number, rating: number, comment: string}
export const postReview = async (
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
    data.book_id = Number(data.book_id)
    data.customer_id = Number(data.customer_id)
    data.rating = Number(data.rating)

    const findReview = await prisma.review.findFirst({
      where: {
        AND: [
          {
            book_id: data.book_id,
          },
          {
            customer_id: data.customer_id,
          },
        ],
      },
    })
    if (findReview) {
      return next(errorHandler(409, "Review for book already exist"))
    }

    const createReview = await prisma.review.create({
      data: data,
    })
    if (!createReview) {
      return next(errorHandler(400, "Error posting review"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: createReview,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Delete Review by Id
// @route DELETE /api/review/:id
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    const deletedReview = await prisma.review.delete({
      where: {
        review_id: id,
      },
    })

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Review successfully deleted",
    })
  } catch (error) {
    return next(error)
  }
}
