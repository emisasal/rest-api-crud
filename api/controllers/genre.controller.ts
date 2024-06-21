import { NextFunction, Request, Response } from "express"
import { prisma } from "../config/prismaClient"
import redis from "../config/redisClient"
import errorHandler from "../utils/errorHandler"
import paginationHandler from "../utils/paginationHandler"

const pageSize = 20

// @desc Get list of Genres w/ pagination and filter
// @route GET /api/genre?page={number}&order={ asc | desc }&name={string}
export const getAllGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageReq = Number(req.query.page)
    const sort: string = "name"
    const order = req.query.order?.toString() || "asc"
    const name = req.query.name?.toString() || ""

    const CACHE_KEY = `getAllGenres:page=${pageReq}&order=${order}&name=${name}`

    const genresCache = await redis.get(CACHE_KEY)
    if (genresCache) {
      const cachedData = JSON.parse(genresCache)
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: cachedData.genresList,
        count: cachedData.count,
        page: cachedData.page,
        limit: cachedData.limit,
        cache: true,
      })
    }

    let where = {}
    if (name) {
      where = {
        name: { contains: name, mode: "insensitive" },
      }
    }

    const count = await prisma.genre.count({ where })
    const { limit, page } = paginationHandler({
      count,
      pageSize,
      page: Number(req.query.page),
    })

    const genresList = await prisma.genre.findMany({
      where,
      orderBy: { [sort]: order },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!genresList) {
      return next(errorHandler(400, "Error getting Genre list"))
    }

    redis.set(
      CACHE_KEY,
      JSON.stringify({ genresList, count, page, limit }),
      "EX",
      3600
    )

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: genresList,
      count: count,
      page: page,
      limit: limit,
      cache: false,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Get single Genre by Id
// @route GET /api/genre/:id
export const getGenreById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    const genreById = await prisma.genre.findUnique({
      where: {
        genre_id: id,
      },
    })

    if (!genreById) {
      return next(errorHandler(400, "Genre Not Found"))
    }

    return res
      .status(200)
      .send({ success: true, statusCode: 200, data: genreById })
  } catch (error) {
    return next(error)
  }
}

// @desc Create new Genre
// @route POST /api/genre
// @body {name: string, description: string}
export const postGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    data.name = data.name.toLowerCase()
    data.description = data.description || null

    const findGenre = await prisma.genre.findFirst({
      where: {
        name: data.name,
      },
    })
    if (findGenre) {
      return next(errorHandler(400, "Genre already registred"))
    }

    const newGenre = await prisma.genre.create({
      data: data,
    })
    if (!newGenre) {
      return next(errorHandler(409, "Error Creating Genre"))
    }

    const cacheKeys = await redis.keys("getAllGenres:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(201).send({
      success: true,
      statusCode: 201,
      data: newGenre,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Modify Genre by Id
// @route PATCH /api/genre/:id
// @body {name: string, description: string}
export const patchGenreById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)
    const data = req.body
    if (data.name) {
      data.name = data.name.toLowerCase()
    }

    const patchedGenre = await prisma.genre.update({
      where: {
        genre_id: id,
      },
      data: data,
    })

    if (!patchedGenre) {
      return next(errorHandler(409, "Error updating Genre"))
    }

    const cacheKeys = await redis.keys("getAllGenres:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: patchedGenre,
    })
  } catch (error) {
    next(error)
  }
}

// @desc Remove Genre
// @route DELETE /api/genre/:id
export const deleteGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    await prisma.genre.delete({
      where: {
        genre_id: id,
      },
    })

    const cacheKeys = await redis.keys("getAllGenres:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Genre successfully deleted",
    })
  } catch (error) {
    return next(error)
  }
}
