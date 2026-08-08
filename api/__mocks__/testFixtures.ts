import { randomBytes } from "node:crypto"
import request from "supertest"
import app from "../app"
import { prisma } from "../config/prismaClient"

export type CustomerFixture = {
	first_name: string
	last_name: string
	email: string
	password: string
}

export type AuthorFixture = {
	first_name: string
	last_name: string
	bio?: string
}

export type GenreFixture = {
	name: string
	description?: string
}

export type PublisherFixture = {
	publisher_name: string
	phone_number: string
	contact_name?: string
}

export type BookFixture = {
	title: string
	description: string
	author_id: number
	genre_id: number
	publisher_id: number
	price: number
	publish_date: string
	isbn: string
}

export const uniqueCustomer = (
	overrides: Partial<CustomerFixture> = {},
): CustomerFixture => {
	const id = randomBytes(6).toString("hex")
	return {
		first_name: "Test",
		last_name: "User",
		email: `test-${id}@example.com`,
		password: "TestPassw@rd1",
		...overrides,
	}
}

export const uniqueAuthor = (
	overrides: Partial<AuthorFixture> = {},
): AuthorFixture => {
	const id = randomBytes(6).toString("hex")
	return {
		first_name: `Author${id.slice(0, 4)}`,
		last_name: `Name${id.slice(4)}`,
		bio: "Test author biography",
		...overrides,
	}
}

export const uniqueGenre = (
	overrides: Partial<GenreFixture> = {},
): GenreFixture => {
	const id = randomBytes(6).toString("hex")
	return {
		name: `genre-${id}`,
		description: "Test genre description",
		...overrides,
	}
}

export const uniquePublisher = (
	overrides: Partial<PublisherFixture> = {},
): PublisherFixture => {
	const id = randomBytes(6).toString("hex")
	return {
		publisher_name: `publisher ${id}`,
		phone_number: `555-${id.slice(0, 4)}`,
		contact_name: `contact ${id.slice(0, 4)}`,
		...overrides,
	}
}

export const uniqueBook = (
	overrides: Partial<BookFixture> &
		Pick<BookFixture, "author_id" | "genre_id" | "publisher_id">,
): BookFixture => {
	const id = randomBytes(6).toString("hex")
	return {
		title: `book title ${id}`,
		description: "Test book description",
		price: 19.99,
		publish_date: "2020-01-15T00:00:00.000Z",
		isbn: `ISBN-${id.toUpperCase()}`,
		...overrides,
	}
}

export const deleteCustomerByEmail = async (email: string) => {
	await prisma.customer.deleteMany({ where: { email } })
}

export const deleteAuthorById = async (authorId: number) => {
	await prisma.author.deleteMany({ where: { author_id: authorId } })
}

export const deleteGenreById = async (genreId: number) => {
	await prisma.genre.deleteMany({ where: { genre_id: genreId } })
}

export const deletePublisherById = async (publisherId: number) => {
	await prisma.publisher.deleteMany({ where: { publisher_id: publisherId } })
}

export const deleteBookById = async (bookId: number) => {
	await prisma.review.deleteMany({ where: { book_id: bookId } })
	await prisma.orderDetail.deleteMany({ where: { book_id: bookId } })
	await prisma.book.deleteMany({ where: { book_id: bookId } })
}

export const deleteOrderById = async (orderId: number) => {
	await prisma.orderDetail.deleteMany({ where: { order_id: orderId } })
	await prisma.order.deleteMany({ where: { order_id: orderId } })
}

export const deleteReviewById = async (reviewId: number) => {
	await prisma.review.deleteMany({ where: { review_id: reviewId } })
}

export const createAuthenticatedAgent = async () => {
	const customer = uniqueCustomer()
	const agent = request.agent(app)

	const registerRes = await agent
		.post("/api/customer/register")
		.send(customer)
		.expect(201)
	await agent
		.post("/api/customer/login")
		.send({ email: customer.email, password: customer.password })
		.expect(200)

	return {
		agent,
		customer,
		customerId: registerRes.body.data.customer_id as number,
	}
}

/** Creates author + genre + publisher + book for FK-dependent tests. */
export const createBookGraph = async (
	agent: ReturnType<typeof request.agent>,
) => {
	const authorRes = await agent.post("/api/author").send(uniqueAuthor())
	const genreRes = await agent.post("/api/genre").send(uniqueGenre())
	const publisherRes = await agent
		.post("/api/publisher")
		.send(uniquePublisher())

	const authorId = authorRes.body.data.author_id as number
	const genreId = genreRes.body.data.genre_id as number
	const publisherId = publisherRes.body.data.publisher_id as number

	const bookRes = await agent.post("/api/book").send(
		uniqueBook({
			author_id: authorId,
			genre_id: genreId,
			publisher_id: publisherId,
		}),
	)

	return {
		authorId,
		genreId,
		publisherId,
		bookId: bookRes.body.data.book_id as number,
		book: bookRes.body.data,
	}
}
