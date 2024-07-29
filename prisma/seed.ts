import { prisma } from "../api/config/prismaClient"
import bcrypt from "bcrypt"
import generateRandomString from "../api/utils/generateRandomString"

import { bookSeed } from "./seedData/book.seed"
import { authorSeed } from "./seedData/author.seed"
import { genreSeed } from "./seedData/genre.seed"
import { publisherSeed } from "./seedData/publisher.seed"
import { customerSeed } from "./seedData/customer.seed"
import { orderSeed } from "./seedData/order.seed"
import { orderDetailSeed } from "./seedData/orderDetail.seed"
import { reviewSeed } from "./seedData/review.seed"

// Execute seeding with "npm run seed" script.

const booksIsoDate = bookSeed.map((book) => {
	return (book = {
		...book,
		publish_date: new Date(book.publish_date).toISOString(),
	})
})

const customersIsoDate = customerSeed.map((customer) => {
	return (customer = {
		...customer,
		created_at: new Date(customer.created_at).toISOString(),
	})
})

const customerPassword = customersIsoDate.map((customer) => {
	const saltRounds = 2
	const hashPassword = bcrypt.hashSync(generateRandomString(10), saltRounds)
	return (customer = { ...customer, password: hashPassword })
})

const ordersIsoDate = orderSeed.map((order) => {
	return (order = {
		...order,
		order_date: new Date(order.order_date).toISOString(),
	})
})

const reviewsIsoDate = reviewSeed.map((review) => {
	return (review = {
		...review,
		created_at: new Date(review.created_at).toISOString(),
	})
})

async function runSeeders() {
	// Author
	await Promise.all(
		authorSeed.map(async (author) =>
			prisma.author.upsert({
				where: { author_id: author.author_id },
				update: {},
				create: author,
			}),
		),
	)
	await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Author"', 'author_id'), coalesce(max(author_id)+1, 1), false) FROM "Author";`

	// Genre
	await Promise.all(
		genreSeed.map(async (genre) =>
			prisma.genre.upsert({
				where: { genre_id: genre.genre_id },
				update: {},
				create: genre,
			}),
		),
	)
	await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Genre"', 'genre_id'), coalesce(max(genre_id)+1, 1), false) FROM "Genre";`

	// Publisher
	await Promise.all(
		publisherSeed.map(async (publisher) =>
			prisma.publisher.upsert({
				where: { publisher_id: publisher.publisher_id },
				update: {},
				create: publisher,
			}),
		),
	)
	await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Publisher"', 'publisher_id'), coalesce(max(publisher_id)+1, 1), false) FROM "Publisher";`

	// Books
	await Promise.all(
		booksIsoDate.map(async (book) =>
			prisma.book.upsert({
				where: { book_id: book.book_id },
				update: {},
				create: book,
			}),
		),
	)
	await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Book"', 'book_id'), coalesce(max(book_id)+1, 1), false) FROM "Book";`

	// Customer
	await Promise.all(
		customerPassword.map(async (customer) =>
			prisma.customer.upsert({
				where: { customer_id: customer.customer_id },
				update: {},
				create: customer,
			}),
		),
	)
	await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Customer"', 'customer_id'), coalesce(max(customer_id)+1, 1), false) FROM "Customer";`

	// Order
	await Promise.all(
		ordersIsoDate.map(async (order) =>
			prisma.order.upsert({
				where: { order_id: order.order_id },
				update: {},
				create: order,
			}),
		),
	)
	await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Order"', 'order_id'), coalesce(max(order_id)+1, 1), false) FROM "Order";`

	// Order Detail
	await Promise.all(
		orderDetailSeed.map(async (orderDetail) =>
			prisma.orderDetail.upsert({
				where: { order_detail_id: orderDetail.order_detail_id },
				update: {},
				create: orderDetail,
			}),
		),
	)
	await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"OrderDetail"', 'order_detail_id'), coalesce(max(order_detail_id)+1, 1), false) FROM "OrderDetail";`

	// Review
	await Promise.all(
		reviewsIsoDate.map(async (review) =>
			prisma.review.upsert({
				where: { review_id: review.review_id },
				update: {},
				create: review,
			}),
		),
	)
	await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Review"', 'review_id'), coalesce(max(review_id)+1, 1), false) FROM "Review";`

	// Sum Order total_amount
	await Promise.all(
		ordersIsoDate.map(async (order) => {
			const orderData = await prisma.order.findUnique({
				where: {
					order_id: order.order_id,
				},
				include: {
					OrderDetail: true,
				},
			})

			const ordersTotal = orderData?.OrderDetail.reduce((acc, obj) => {
				return (acc = acc + Number(obj.price_per_item) * obj.quantity)
			}, 0)

			return prisma.order.update({
				where: {
					order_id: order.order_id,
				},
				data: {
					total_amount: ordersTotal,
				},
			})
		}),
	)
}

runSeeders()
	.catch((e) => {
		console.error(`There was an error while seeding: ${e}`)
		process.exit(1)
	})
	.finally(async () => {
		console.log("Successfully seeded database. Closing connection.")
		await prisma.$disconnect()
	})
