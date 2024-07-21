import type { Request, Response, NextFunction } from "express"
import { prisma } from "../config/prismaClient"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"
import paginationHandler from "../utils/paginationHandler"
import redis from "../config/redisClient"

const pageSize = 20

// @desc Get Customers list w/ pagination and filter
// @route GET /api/customer?page={number}&sort={ first_name | last_name }&order={ asc | desc }&name{ string }&email={string}
export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageReq = Number(req.query.page)
    const sort = req.query.sort?.toString() || "last_name"
    const order = req.query.order?.toString() || "asc"
    const name = req.query.name?.toString() || ""
    const email = req.query.email?.toString() || ""

    const CACHE_KEY = `getAllCustomers:page=${pageReq}&sort=${sort}&order=${order}&name=${name}&email=${email}`

    const customersCache = await redis.get(CACHE_KEY)
    if (customersCache) {
      const cachedData = JSON.parse(customersCache)
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: cachedData.customerListNoPassword,
        count: cachedData.count,
        page: cachedData.page,
        limit: cachedData.limit,
        cache: true,
      })
    }

    let where = {}
    if (name) {
      where = {
        ...where,
        OR: [
          {
            last_name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            first_name: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      }
    }
    if (email) {
      where = { ...where, email: { contains: email, mode: "insensitive" } }
    }

    const count = await prisma.customer.count({ where })
    const { limit, page } = paginationHandler({
      count,
      pageSize,
      page: Number(req.query.page),
    })

    const customerList = await prisma.customer.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!customerList) {
      return next(errorHandler(400, "Error getting Customers"))
    }

    const customerListNoPassword = customerList.map(
      ({ password, ...rest }) => ({
        ...rest,
      })
    )

    redis.set(
      CACHE_KEY,
      JSON.stringify({ customerListNoPassword, count, page, limit }),
      "EX",
      3600
    )

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: customerListNoPassword,
      count: count,
      page: page,
      limit: limit,
      cache: false,
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

// @desc Modify Customer by Id
// @route PATCH /api/customer/:id
// @body {first_name: string, last_name: string, email: string, password: string}
export const patchCustomerByid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)
    const data = req.body
    if (data.first_name) {
      data.first_name = capitalizeWords(data.first_name)
    }
    if (data.last_name) {
      data.last_name = capitalizeWords(data.last_name)
    }

    const patchedCustomer = await prisma.customer.update({
      where: {
        customer_id: id,
      },
      data: data,
    })

    if (!patchedCustomer) {
      return next(errorHandler(409, "Error updating customer"))
    }

    const cacheKeys = await redis.keys("getAllCustomers:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    const { password, created_at, updated_at, ...patchedCustomerNoPass } =
      patchedCustomer

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: patchedCustomerNoPass,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Remove Customer by Id
// @route DELETE /api/customer/:id
export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    await prisma.customer.delete({
      where: {
        customer_id: id,
      },
    })

    const cacheKeys = await redis.keys("getAllCustomers:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Customer successfully deleted",
    })
  } catch (error) {
    return next(error)
  }
}
