import { NextFunction, Request, Response } from "express"
import path from "path"

export const getImageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../../bookCovers", `${id}.jpg`),
        (err) => {
          if (err) {
            res
              .status(422)
              .send({
                success: false,
                statusCode: 422,
                message: `Unable to get image ${id}.jpg`,
              })
              .end()
          }
        }
      )
  } catch (error) {
    return next(error)
  }
}
