import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { validationResult } from "express-validator"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"

const pageSize = 20

// @desc Get list of Orders w/ pagination and filter
// @route /api/order?page={number}&sort={ order_date | total_amount }&order={ asc | desc }&customer={ customer_id }&dateinit={yyyy-dd-mm}&dateend={yyyy-dd-mm}
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort = req.query.sort?.toString().toLowerCase() || "order_date"
    const order = req.query.order?.toString().toLowerCase() || "desc"
    const customer = Number(req.query.customer) || null
    const dateinit = req.query.dateinit?.toString() || ""
    const dateend = req.query.dateend?.toString() || ""

    const whereHandler = (
      customer: number | null,
      dateinit: string | null,
      dateend: string | null
    ) => {
      let where = {}
      if (customer) {
        where = { customer_id: customer }
      }
      if (dateinit && dateend) {
        where = {
          ...where,
          order_date: {
            gte: new Date(dateinit),
            lte: new Date(dateend),
          },
        }
      }
      return where
    }

    const where = whereHandler(customer, dateinit, dateend)

    const count = await prisma.order.count({ where })
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    if (page > limit) {
      page = limit
    }

    const ordersList = await prisma.order.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!ordersList) {
      return next(errorHandler(409, "Error getting Orders"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: ordersList,
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
// @body

// @desc
// @route
// @body

// @desc
// @route
// @body

// @desc
// @route
// @body

// @desc
// @route
// @body
