import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { prisma } from "../config/prismaClient"
import redis from "../config/redisClient"
import capitalizeWords from "../utils/capitalizeWords"
import errorHandler from "../utils/errorHandler"
import paginationHandler from "../utils/paginationHandler"

const pageSize = 20

// @desc Get list of Publisher w/ pagination and filter
// @route GET /api/publisher?page={number}&order={ asc | desc}&name={string}
export const getAllPublishers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageReq = Number(req.query.page)
    const sort: string = "publisher_name"
    const order = req.query.order?.toString() || "asc"
    const name = req.query.name?.toString() || ""

    const CACHE_KEY = `getAllPublishers:page=${pageReq}&order=${order}&name=${name}`

    const publishersCachedData = await redis.get(CACHE_KEY)
    if (publishersCachedData) {
      const cachedData = JSON.parse(publishersCachedData)
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: cachedData.publisherList,
        count: cachedData.count,
        page: cachedData.page,
        limit: cachedData.limit,
        cache: true,
      })
    }

    const where: Prisma.PublisherWhereInput =
      { publisher_name: { contains: name, mode: "insensitive" } } || {}

    const count = await prisma.publisher.count({ where })
    const { limit, page } = paginationHandler({
      count,
      pageSize,
      page: Number(req.query.page),
    })

    const publisherList = await prisma.publisher.findMany({
      where,
      orderBy: { [sort]: order },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!publisherList) {
      return next(errorHandler(400, "Error getting Publisher list"))
    }

    redis.set(
      CACHE_KEY,
      JSON.stringify({ publisherList, count, page, limit }),
      "EX",
      3600
    )

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: publisherList,
      count: count,
      page: page,
      limit: limit,
      cache: false,
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
// @body {publisher_name: string, contact_name: string, phone_number: string}
export const postPublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    const cacheKeys = await redis.keys("getAllPublishers:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(201).send({
      success: true,
      statusCode: 201,
      data: newPublisher,
    })
  } catch (error) {
    next(error)
  }
}

// @desc Modify Publisher by Id
// @route PATCH /api/publisher/:id
// @body {publisher_name: string, contact_name: string, phone_number: string}
export const patchPublisherById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    if (!patchedPublisher) {
      return next(errorHandler(409, "Error updating publisher"))
    }

    const cacheKeys = await redis.keys("getAllPublishers:*")
    cacheKeys ?? (await redis.del(cacheKeys))

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

    if (!deletedPublisher) {
      return next(errorHandler(409, "Error deleting publisher"))
    }

    const cacheKeys = await redis.keys("getAllPublishers:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Publisher successfully deleted",
    })
  } catch (error) {
    next(error)
  }
}
