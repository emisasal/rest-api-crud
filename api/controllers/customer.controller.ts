import { Request, Response, NextFunction, response } from "express"
import { Prisma } from "@prisma/client"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"

const pageSize = 20

// @desc Get Customers list w/ pagination and filter
// @route GET /api/customer?page={number}&sort={ first_name | last_name }&order={ asc | desc }&filterBy{ first_name | last_name | email }&filterval={string}
export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort = req.query.sort?.toString() || "last_name"
    const order = req.query.order?.toString() || "asc"
    const filterBy = req.query.filterBy?.toString() || ""
    const filterval = req.query.filterval?.toString() || ""

    const where: Prisma.CustomerWhereInput = filterBy
      ? { [filterBy]: { contains: filterval, mode: "insensitive" } }
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
// @body {first_name: string, last_name: string, email: string}
export const postCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    data.first_name = capitalizeWords(data.first_name)
    data.last_name = capitalizeWords(data.last_name)
    data.email = data.email

    const findCustomer = await prisma.customer.findFirst({
      where: { email: data.email },
    })
    if (findCustomer) {
      return next(errorHandler(409, "Customer arleady registered"))
    }

    const newCustomer = await prisma.customer.create({
      data: data,
    })
    if (!newCustomer) {
      return next(errorHandler(400, "Error creating Customer"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: newCustomer,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Modify Customer by Id
// @route PATCH /api/customer/:id
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
    if (data.email) {
      data.email = data.email
    }

    const patchedCustomer = await prisma.customer.update({
      where: {
        customer_id: id,
      },
      data: data,
    })

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: patchedCustomer,
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

    const deletedCustomer = await prisma.customer.delete({
      where: {
        customer_id: id,
      },
    })

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Customer successfully deleted",
    })
  } catch (error) {
    return next(error)
  }
}
