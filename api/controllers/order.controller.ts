import type { NextFunction, Request, Response } from "express"
import { prisma } from "@/config/prismaClient"
import errorHandler from "../utils/errorHandler"
import paginationHandler from "../utils/paginationHandler"
import redis from "../config/redisClient"

const pageSize = 20

// @desc Get list of Orders w/ pagination and filter
// @route /api/order?page={number}&sort={ order_date | total_amount }&order={ asc | desc }&customer={ customer_id }&dateStart={yyyy-dd-mm}&dateEnd={yyyy-dd-mm}
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageReq = Number(req.query.page)
    const sort = req.query.sort?.toString() || "order_date"
    const order = req.query.order?.toString() || "desc"
    const customer = Number(req.query.customer) || null
    const dateStart = req.query.dateStart?.toString() || ""
    const dateEnd = req.query.dateEnd?.toString() || ""

    const CACHE_KEY = `getAllOrders:page=${pageReq}&sort=${sort}&order=${order}&customer=${customer}&dateStart=${dateStart}&dateEnd=${dateEnd}`

    const ordersCache = await redis.get(CACHE_KEY)
    if (ordersCache) {
      const cachedData = JSON.parse(ordersCache)
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: cachedData.ordersList,
        count: cachedData.count,
        page: cachedData.page,
        limit: cachedData.limit,
        cache: true,
      })
    }

    const whereHandler = (
      customer: number | null,
      dateStart: string | null,
      dateEnd: string | null
    ) => {
      let where = {}
      if (customer) {
        where = { customer_id: customer }
      }
      if (dateStart && dateEnd) {
        where = {
          ...where,
          order_date: {
            gte: new Date(dateStart),
            lte: new Date(dateEnd),
          },
        }
      }
      return where
    }

    const where = whereHandler(customer, dateStart, dateEnd)

    const count = await prisma.order.count({ where })
    const { limit, page } = paginationHandler({
      count,
      pageSize,
      page: Number(req.query.page),
    })

    const ordersList = await prisma.order.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!ordersList) {
      return next(errorHandler(400, "Error getting Orders"))
    }

    redis.set(
      CACHE_KEY,
      JSON.stringify({ ordersList, count, page, limit }),
      "EX",
      3600
    )

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: ordersList,
      count: count,
      page: page,
      limit: limit,
      cache: false,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Get Order by Id
// @route /api/order/:id
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    const orderById = await prisma.order.findUnique({
      where: {
        order_id: id,
      },
      include: {
        customer: true,
        OrderDetail: {
          include: {
            book: true,
          },
        },
      },
    })

    if (!orderById) {
      return next(errorHandler(400, "Order not found"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: orderById,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Create new Order
// @route POST /api/order
// @body {customer_id: number, books: [{book_id: number, quantity: number}]}
export const postOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    const customer_id = Number(data.customer_id)
    const books = data.books
    const bookIdlist = books.map((book: { book_id: number }) => {
      return book.book_id
    })

    const booksData = await prisma.book.findMany({
      where: {
        book_id: { in: bookIdlist },
      },
    })

    const booksPrice = []
    for (let i = 0; i < books.length; i++) {
      const priceBook = booksData.filter(
        (book) => book.book_id === books[i].book_id
      )
      booksPrice.push({ ...books[i], price_per_item: priceBook[0].price })
    }

    const total_amount = booksPrice.reduce(
      (acc: number, val: { price_per_item: number; quantity: number }) => {
        return acc + val.price_per_item * val.quantity
      },
      0
    )

    const newOrder = await prisma.order.create({
      data: {
        customer_id: customer_id,
        total_amount: total_amount,
        OrderDetail: {
          create: booksPrice,
        },
      },
    })
    if (!newOrder) {
      return next(errorHandler(409, "Error creating Order"))
    }

    const cacheKeys = await redis.keys("getAllOrders:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(201).send({
      success: true,
      statusCode: 201,
      data: newOrder,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Remove Order by Id
// @route DELETE /api/order/:id
export const deleteOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    const deletedOrder = await prisma.order.delete({
      where: {
        order_id: id,
      },
    })

    if (!deletedOrder) {
      return next(errorHandler(409, "Error deleting Order"))
    }

    const cacheKeys = await redis.keys("getAllOrders:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Order successfully deleted",
    })
  } catch (error) {
    next(error)
  }
}
