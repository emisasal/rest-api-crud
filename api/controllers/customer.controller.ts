import { Request, Response, NextFunction, response } from "express"
import { Prisma } from "@prisma/client"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"

const pageSize = 20

// @desc Get Customers list w/ pagination and filter
// @route GET /api/customer?page={number}&sort={ first_name | last_name }&order={ asc | desc }&filterkey{ first_name | last_name | email }&filterval={string}
export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort = req.query.sort?.toString().toLowerCase() || "last_name"
    const order = req.query.order?.toString().toLowerCase() || "asc"
    const filterkey = req.query.filterkey?.toString() || ""
    const filterval = req.query.filterval?.toString() || ""

    const where: Prisma.CustomerWhereInput = filterkey
      ? { [filterkey]: { contains: filterval, mode: "insensitive" } }
      : {}

    const count = await prisma.customer.count({ where })
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    if (page > limit) {
      page = limit
    }

    const customerList = await prisma.customer.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!customerList) {
      return next(errorHandler(409, "Error getting Customers"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: customerList,
      count: count,
      page: page,
      limit: limit,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Get Customer by Id
// @route GET /api/customer/:id
export const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    const customerByid = await prisma.customer.findUnique({
      where: {
        customer_id: id,
      },
      include: {
        Order: true,
        Review: true,
      },
    })

    if (!customerByid) {
      return next(errorHandler(400, "Customer not found"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: customerByid,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Create new Customer
// @route POST /api/customer

// @desc Modify Customer by Id
// @route PATCH /api/customer/:id

// @desc Remove Customer by Id
// @route DELETE /api/customer/:id

// @desc
// @route

// @desc
// @route
