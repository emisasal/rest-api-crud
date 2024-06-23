import {
  deleteAuthorDoc,
  getAllAuthorsDoc,
  getAuthorByIdDoc,
  patchAuthorDoc,
  postAuthorDoc,
} from "./author.docs"
import {
  deleteBookDoc,
  getAllBooksDoc,
  getBookByIdDoc,
  patchBookDoc,
  postBookDoc,
} from "./book.docs"
import { getCategoryDoc, getModelsDoc } from "./category.docs"
import {
  deleteCustomerDoc,
  getAllCustomersDoc,
  getCustomerByIdDoc,
  patchCustomerDoc,
} from "./customer.docs"
import {
  deleteGenreDoc,
  getAllGenresDoc,
  getGenreByIdDoc,
  patchGenreDoc,
  postGenreDoc,
} from "./genre.docs"
import { getImageByIdDocs } from "./image.docs"
import {
  deleteOrderDoc,
  getAllOrdersDoc,
  getOrderByIdDoc,
  postOrderDoc,
} from "./order.docs"
import {
  deletePublisherDoc,
  getAllPublishersDoc,
  getPublisherByIdDoc,
  patchPublisherDoc,
  postPublisherDoc,
} from "./publisher.docs"
import {
  deleteReviewDoc,
  getAllReviewsDoc,
  getReviewByIdDoc,
  postReviewDoc,
} from "./review.docs"

const swaggerSpec = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "Rest-Api-Crud Documentation",
    description: "API endpoints documentation for the project Rest-Api-Crud.",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Local Server",
    },
    {
      url: "https://api.productionapiexample.com",
      description: "Production Server",
    },
  ],
  tags: [
    {
      name: "Author",
    },
    {
      name: "Book",
    },
    {
      name: "Category",
    },
    {
      name: "Customer",
    },
    {
      name: "Customer Session",
    },
    {
      name: "Genre",
    },
    {
      name: "Image",
    },
    {
      name: "Order",
    },
    {
      name: "Publisher",
    },
    {
      name: "Review",
    },
  ],
  paths: {
    "/api/book": {
      get: getAllBooksDoc,
      post: postBookDoc,
    },
    "/api/book/:id": {
      get: getBookByIdDoc,
      patch: patchBookDoc,
      delete: deleteBookDoc,
    },
    "/api/author": {
      get: getAllAuthorsDoc,
      post: postAuthorDoc,
    },
    "/api/author/:id": {
      get: getAuthorByIdDoc,
      patch: patchAuthorDoc,
      delete: deleteAuthorDoc,
    },
    "/api/category": {
      get: getModelsDoc,
    },
    "/api/category/:name": {
      get: getCategoryDoc,
    },
    "/api/customer": {
      get: getAllCustomersDoc,
    },
    "/api/customer/:id": {
      get: getCustomerByIdDoc,
      patch: patchCustomerDoc,
      delete: deleteCustomerDoc,
    },
    "/api/genre": {
      get: getAllGenresDoc,
      post: postGenreDoc,
    },
    "/api/genre/:id": {
      get: getGenreByIdDoc,
      patch: patchGenreDoc,
      delete: deleteGenreDoc,
    },
    "/api/image/:id": {
      get: getImageByIdDocs,
    },
    "/api/order": {
      get: getAllOrdersDoc,
      post: postOrderDoc,
    },
    "/api/order/:id": {
      get: getOrderByIdDoc,
      delete: deleteOrderDoc,
    },
    "/api/publisher": {
      get: getAllPublishersDoc,
      post: postPublisherDoc,
    },
    "/api/publisher/:id": {
      get: getPublisherByIdDoc,
      patch: patchPublisherDoc,
      delete: deletePublisherDoc,
    },
    "/api/review": {
      get: getAllReviewsDoc,
      post: postReviewDoc,
    },
    "/api/review/:id": {
      get: getReviewByIdDoc,
      delete: deleteReviewDoc,
    },
  },
}

export default swaggerSpec
