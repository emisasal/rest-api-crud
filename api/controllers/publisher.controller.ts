import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"

const pageSize = 20

// @desc Get list of Publisher w/ pagination and filter
// @route GET /api/publisher?page={number}&order={ asc | desc}&filterval={}
export const getAllPublishers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort: string = "publisher_name"
    const order = req.query.order?.toString().toLowerCase() || "asc"
    const filterval = req.query.filterval?.toString() || ""

    const where: Prisma.PublisherWhereInput =
      { publisher_name: { contains: filterval, mode: "insensitive" } } || {}

    const count = await prisma.publisher.count({ where })
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    if (page > limit) {
      page = limit
    }

    const publisherList = await prisma.publisher.findMany({
      where,
      orderBy: { [sort]: order },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!publisherList) {
      return next(errorHandler(400, "Error getting Publisher list"))
    }

    return res
      .status(200)
      .send({
        success: true,
        statusCode: 200,
        data: publisherList,
        count: count,
        page: page,
        limit: limit,
      })
  } catch (error) {
    return next(error)
  }
}

// @desc Get single Publisher by Id
// @route GET /api/publisher/:id

// @desc Create new Publisher
// @route POST /api/publisher

// @desc Modify Publisher by Id
// @route PATCH /api/publisher/:id

// @desc Remove Publisher
// @route DELETE /api/publisher/:id
