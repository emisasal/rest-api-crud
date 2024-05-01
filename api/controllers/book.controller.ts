import { Request, Response } from "express"
import { prisma } from "../client"

// Pagination
// Filter
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const bookList = await prisma.book.findMany()

    return res.status(200).send(bookList)
  } catch (error) {
    return res.status(400).send({ error })
  }
}

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const bookById = await prisma.book.findUnique({
      where: {
        book_id: Number(id),
      },
      include: {
        author: true,
        genre: true,
        publisher: true,
      },
    })

    if (!bookById) {
      return res.sendStatus(204)
    }

    return res.status(200).send(bookById)
  } catch (error) {
    return res
      .status(400)
      .send({ error: `Error getting book_id ${id}: ${error}` })
  }
}
