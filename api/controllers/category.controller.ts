import { Request, Response, NextFunction } from "express"
import { Prisma } from "@prisma/client"
import capitalizeWords from "../utils/capitalizeWords"
import errorHandler from "../utils/errorHandler"

export const getModels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const modelList = Prisma.dmmf.datamodel.models
      .map((mod) => [mod.name])
      .flat(2)

    if (!modelList) {
      return next(errorHandler(400, "Error getting models list"))
    }

    return res
      .status(200)
      .send({ success: true, statusCode: 200, data: modelList })
  } catch (error) {
    next(error)
  }
}

// @desc Get list of values / table's columns names
// @route GET /api/category/:model
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query

    if (!name) {
      return next(errorHandler(409, "Error gettig model param"))
    }

    const modelCap = capitalizeWords(name.toString())

    const categoryList = Prisma.dmmf.datamodel.models
      .filter((model) => model.name === modelCap)
      .map((mod) => [mod.fields.map((a) => a.name)])
      .flat(2)

    if (!categoryList) {
      return next(errorHandler(400, "Error getting categories list"))
    }

    return res
      .status(200)
      .send({ sucess: true, statusCode: 200, data: categoryList })
  } catch (error) {
    return next(error)
  }
}
