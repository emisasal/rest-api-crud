import { Request, Response } from "express"
import { prisma } from "../client"

const pageSize = 20

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
      return res.status(200).send("Book not found")
    }
    return res.status(200).send(bookById)
  } catch (error) {
    return res
      .status(400)
      .send({ error: `Error getting book_id ${id}: ${error}` })
  }
}

export const patchBookById = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = req.body
  try {
    const patchedBook = await prisma.book.update({
      where: {
        book_id: Number(id),
      },
      data: data,
    })
    return res.status(200).send(patchedBook)
  } catch (error) {
    return res
      .sendStatus(400)
      .send({ error: `Error patching book_id ${id}: ${error}` })
  }
}

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const deletedBook = await prisma.book.delete({
      where: {
        book_id: Number(id),
      },
    })
    return res.status(204)
  } catch (error) {
    return res
      .status(400)
      .send({ error: `Error deleting book_id ${id}: ${error}` })
  }
}
