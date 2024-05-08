import { Request, Response } from "express"
import path from "path"

export const getImageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../../bookCovers", `${id}.jpg`),
        (err) => {
          if (err) {
            res.status(422).send(err).end()
          }
        }
      )
  } catch (error) {
    return res.status(400).send({ error: `Error getting book cover: ${error}` })
  }
}
