import { prisma } from "../api/client"

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
    registration_date: new Date(customer.registration_date).toISOString(),
  })
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
    review_date: new Date(review.review_date).toISOString(),
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
      })
    )
  )
  // Genre
  await Promise.all(
    genreSeed.map(async (genre) =>
      prisma.genre.upsert({
        where: { genre_id: genre.genre_id },
        update: {},
        create: genre,
      })
    )
  )
  // Publisher
  await Promise.all(
    publisherSeed.map(async (publisher) =>
      prisma.publisher.upsert({
        where: { publisher_id: publisher.publisher_id },
        update: {},
        create: publisher,
      })
    )
  )
  // Books
  await Promise.all(
    booksIsoDate.map(async (book) =>
      prisma.book.upsert({
        where: { book_id: book.book_id },
        update: {},
        create: book,
      })
    )
  )
  // Customer
  await Promise.all(
    customersIsoDate.map(async (customer) =>
      prisma.customer.upsert({
        where: { customer_id: customer.customer_id },
        update: {},
        create: customer,
      })
    )
  )
  // Order
  await Promise.all(
    ordersIsoDate.map(async (order) =>
      prisma.order.upsert({
        where: { order_id: order.order_id },
        update: {},
        create: order,
      })
    )
  )
  // Order Detail
  await Promise.all(
    orderDetailSeed.map(async (orderDetail) =>
      prisma.orderDetail.upsert({
        where: { order_detail_id: orderDetail.order_detail_id },
        update: {},
        create: orderDetail,
      })
    )
  )
  // Review
  await Promise.all(
    reviewsIsoDate.map(async (review) =>
      prisma.review.upsert({
        where: { review_id: review.review_id },
        update: {},
        create: review,
      })
    )
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
