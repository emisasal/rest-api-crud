import { Request, Response } from "express"
import { prisma } from "../client"

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const bookList = await prisma.book.findMany()
    console.log("BL", bookList)
    return res.status(200).send(bookList)
  } catch (error) {
    return res.status(401).send({ error })
  }
}
