import { NextFunction, Request, Response } from "express"
import { prisma } from "../config/prismaClient"
import errorHandler from "../utils/errorHandler"
import paginationHandler from "../utils/paginationHandler"
import redis from "config/redisClient"

const pageSize = 20

// @desc Get all the Reviews w/ pagination and filter
// @route GET /api/review?page={number}&sort={ review_date | rating }&order={ asc | desc }&book_id={ number}&customer_id={ number }&rateMin={number}&rateMax={number}
export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageReq = Number(req.query.page)
    const sort = req.query.sort?.toString() || "review_date"
    const order = req.query.order?.toString() || "desc"
    const book_id = Number(req.query.book_id) || 0
    const customer_id = Number(req.query.customer_id) || 0
    const rateMin = Number(req.query.rateMin) || 0
    const rateMax = Number(req.query.rateMax) || 0

    const CACHE_KEY = `getAllReviews:page=${pageReq}&sort=${sort}&order=${order}&book_id=${book_id}&customer_id=${customer_id}&rateMin=${rateMin}&rateMax=${rateMax}`

    const reviewsCache = await redis.get(CACHE_KEY)
    if (reviewsCache) {
      const cachedData = JSON.parse(reviewsCache)
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: cachedData.reviewList,
        count: cachedData.count,
        page: cachedData.page,
        limit: cachedData.limit,
        cache: true,
      })
    }

    let where = {}
    if (book_id) {
      where = { ...where, book_id: book_id }
    }
    if (customer_id) {
      where = { ...where, customer_id: customer_id }
    }
    if (rateMin && rateMax) {
      where = {
        ...where,
        rating: {
          gte: rateMin,
          lte: rateMax,
        },
      }
    }

    const count = await prisma.review.count({ where })
    const { limit, page } = paginationHandler({
      count,
      pageSize,
      page: Number(req.query.page),
    })

    const reviewList = await prisma.review.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!reviewList) {
      return next(errorHandler(400, "Error getting Reviews list"))
    }

    redis.set(
      CACHE_KEY,
      JSON.stringify({ reviewList, count, page, limit }),
      "EX",
      3600
    )

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: reviewList,
      count: count,
      page: page,
      limit: limit,
      cache: false,
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
      return next(errorHandler(400, "Review for book already exist"))
    }

    const createReview = await prisma.review.create({
      data: data,
    })
    if (!createReview) {
      return next(errorHandler(409, "Error posting review"))
    }

    const cacheKeys = await redis.keys("getAllReviews:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(201).send({
      success: true,
      statusCode: 201,
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

    if (!deletedReview) {
      return next(errorHandler(409, "Error deleting Review"))
    }

    const cacheKeys = await redis.keys("getAllReviews:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Review successfully deleted",
    })
  } catch (error) {
    return next(error)
  }
}
