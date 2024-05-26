import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { Prisma } from "@prisma/client"
import { prisma } from "../client"
import errorHandler from "../utils/errorHandler"

const pageSize = 20

// @desc Get list of Genres w/ pagination and filter
// @route GET /api/genre?page={number}&order={ asc | desc }&filterBy={string}
export const getAllGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sort: string = "name"
    const order = req.query.order?.toString() || "asc"
    const filterBy = req.query.filterBy?.toString() || ""

    const where: Prisma.GenreWhereInput =
      {
        name: { contains: filterBy, mode: "insensitive" },
      } || {}

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
      return next(errorHandler(400, "Error getting Genre list"))
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
      return next(errorHandler(409, "Genre already registred"))
    }

    const newGenre = await prisma.genre.create({
      data: data,
    })
    if (!newGenre) {
      return next(errorHandler(400, "Error Creating Genre"))
    }

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

    const deletedGenre = await prisma.genre.delete({
      where: {
        genre_id: id,
      },
    })

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Genre successfully deleted",
    })
  } catch (error) {
    return next(error)
  }
}
