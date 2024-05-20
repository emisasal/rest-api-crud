import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { Prisma } from "@prisma/client"
import { prisma } from "../client"
import capitalizeWords from "../utils/capitalizeWords"
import errorHandler from "../utils/errorHandler"

const pageSize = 20

// @desc Get list of Publisher w/ pagination and filter
// @route GET /api/publisher?page={number}&order={ asc | desc}&filter={string}
export const getAllPublishers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort: string = "publisher_name"
    const order = req.query.order?.toString().toLowerCase() || "asc"
    const filter = req.query.filter?.toString() || ""

    const where: Prisma.PublisherWhereInput =
      { publisher_name: { contains: filter, mode: "insensitive" } } || {}

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

    return res.status(200).send({
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
export const getPublisherById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    const publisherByid = await prisma.publisher.findUnique({
      where: {
        publisher_id: id,
      },
    })

    if (!publisherByid) {
      return next(errorHandler(400, "Publisher not found"))
    }

    return res
      .status(200)
      .send({ success: true, statusCode: 200, data: publisherByid })
  } catch (error) {
    return next(error)
  }
}

// @desc Create new Publisher
// @route POST /api/publisher
export const postPublisher = async (
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
    data.publisher_name = capitalizeWords(data.publisher_name)
    if (data.contact_name) {
      data.contact_name = capitalizeWords(data.contact_name)
    }
    data.phone_number = data.phone_number.toLowerCase()

    const findPublisher = await prisma.publisher.findFirst({
      where: { publisher_name: data.publisher_name },
    })
    if (findPublisher) {
      return next(errorHandler(409, "Publisher already registred"))
    }

    const newPublisher = await prisma.publisher.create({
      data: data,
    })
    if (!newPublisher) {
      return next(errorHandler(400, "Error creating Publisher"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: newPublisher,
    })
  } catch (error) {
    next(error)
  }
}

// @desc Modify Publisher by Id
// @route PATCH /api/publisher/:id
export const patchPublisherById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((err) => err.msg)
        .toString()
      return next(errorHandler(422, errorMessages))
    }

    const id = Number(req.params.id)
    const data = req.body
    if (data.publisher_name) {
      data.publisher_name = capitalizeWords(data.publisher_name)
    }
    if (data.contact_name) {
      data.contact_name = capitalizeWords(data.contact_name)
    }
    if (data.phone_number) {
      data.phone_number = data.phone_number.toLowerCase()
    }

    const patchedPublisher = await prisma.publisher.update({
      where: {
        publisher_id: id,
      },
      data: data,
    })

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: patchedPublisher,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Remove Publisher
// @route DELETE /api/publisher/:id
export const deletePublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    const deletedPublisher = await prisma.publisher.delete({
      where: {
        publisher_id: id,
      },
    })

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Publisher successfully deleted",
    })
  } catch (error) {
    next(error)
  }
}
