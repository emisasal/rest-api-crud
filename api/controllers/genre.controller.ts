import { NextFunction, Request, Response } from "express"
import errorHandler from "../utils/errorHandler"
import { prisma } from "../client"
import { Prisma } from "@prisma/client"

const pageSize = 20

// @desc Get list of Genres w/ pagination and filter
// @route GET /api/genre?page={number}&sort{ name }&order={ asc | desc }&filterval={string}
export const getAllGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort = req.query.sort?.toString().toLowerCase() || "name"
    const order = req.query.order?.toString().toLowerCase() || "asc"
    const filterval = req.query.filterval?.toString() || ""

    const where: Prisma.GenreWhereInput = {
      name: { contains: filterval, mode: "insensitive" },
    }

    const count = await prisma.genre.count({ where })
    const limit = Math.floor(count / pageSize)
    let page = Number(req.query.page) || 0
    if (page > limit) {
      page = limit
    }

    const genresList = await prisma.genre.findMany({
      where,
      orderBy: { [sort]: order },
      take: pageSize,
      skip: page * pageSize,
    })

    if (!genresList) {
      return next(errorHandler(400, "Error getting Genres"))
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: genresList,
      count: count,
      page: page,
      limit: limit,
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

// @desc Modify Genre by Id
// @route PATCH /api/genre/:id

// @desc Remove Genre
// @route DELETE /api/genre/:id
