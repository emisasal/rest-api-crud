import { Request, Response } from "express"

export const getAllBooks = (req: Request, res: Response) => {
  try {
    throw "Error getting book list"
    // return res.status(200).send("All the books")
  } catch (error) {
    console.log("error", error)
    return res.status(401).send({ error })
  }
}
