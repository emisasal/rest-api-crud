import { NextFunction, Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { prisma } from "../config/prismaClient"
import redis from "../config/redisClient"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"

const pageSize = 20

// @desc Get list of Authors w/ pagination and filter
// @route GET /api/author?page={number}&sort={ first_name | last_name }&order={ asc | desc }&name={string}
export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageReq = Number(req.query.page)
    const sort = req.query.sort?.toString() || "last_name"
    const order = req.query.order?.toString() || "asc"
    const name = req.query.name?.toString() || ""

    const CACHE_KEY = `getAllAuthors:page=${pageReq}&sort=${sort}&order=${order}&name=${name}`

    const authorsCache = await redis.get(CACHE_KEY)
    if (authorsCache) {
      const cachedData = JSON.parse(authorsCache)
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: cachedData.authorsList,
        count: cachedData.count,
        page: cachedData.page,
        limit: cachedData.limit,
        cache: true,
      })
    }

    const where: Prisma.AuthorWhereInput = {
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

    const count = await prisma.author.count({ where })
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page)
    if (page > limit) {
      page = limit
    }

    const authorsList = await prisma.author.findMany({
      where,
      orderBy: { [sort]: order },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!authorsList) {
      return next(errorHandler(400, "Error getting Authors"))
    }

    redis.set(
      CACHE_KEY,
      JSON.stringify({ authorsList, count, page, limit }),
      "EX",
      3600
    )

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: authorsList,
      count: count,
      page: page,
      limit: limit,
      cache: false,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Get single Author by Id
// @route GET /api/author/:id
export const getAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)
    const authorById = await prisma.author.findUnique({
      where: {
        author_id: id,
      },
    })

    if (!authorById) {
      return next(errorHandler(400, "Author not found"))
    }

    return res
      .status(200)
      .send({ success: true, statusCode: 200, data: authorById })
  } catch (error) {
    return next(error)
  }
}

// @desc Create new Author
// @route POST /api/author
// @body {title: string, description: string, author_id: number, genre_id: number, publisher_id: number, price: number, publish_date: date, isbn: string}
export const postAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    data.first_name = capitalizeWords(data.first_name)
    data.last_name = capitalizeWords(data.last_name)
    data.bio = data.bio || null

    const findAuthor = await prisma.author.findFirst({
      where: {
        first_name: data.first_name,
        last_name: data.last_name,
      },
    })
    if (findAuthor) {
      return next(errorHandler(409, "Author already registred"))
    }

    const newAuthor = await prisma.author.create({
      data: data,
    })
    if (!newAuthor) {
      return next(errorHandler(400, "Error Creating Author"))
    }

    const cacheKeys = await redis.keys("getAllAuthors:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(201).send({
      success: true,
      statusCode: 201,
      data: newAuthor,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Modify Author by Id
// @route PATCH /api/author/:id
// @body {title: string, description: string, author_id: number, genre_id: number, publisher_id: number, price: number, publish_date: date, isbn: string}
export const patchAuthorById = async (
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

    const patchedAuthor = await prisma.author.update({
      where: {
        author_id: id,
      },
      data: data,
    })

    const cacheKeys = await redis.keys("getAllAuthors:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: patchedAuthor,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Remove Author
// @route DELETE /api/author/:id
export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)
    await prisma.author.delete({
      where: {
        author_id: id,
      },
    })

    const cacheKeys = await redis.keys("getAllAuthors:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Author successfully deleted",
    })
  } catch (error) {
    return next(error)
  }
}
