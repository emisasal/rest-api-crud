import * as authorDocs from "./author.docs"
import * as bookDocs from "./book.docs"
import * as categoryDocs from "./category.docs"
import * as customerDocs from "./customer.docs"
import * as customerSessionDocs from "./customerSession.docs"
import * as genreDocs from "./genre.docs"
import { getImageByIdDocs } from "./image.docs"
import * as orderDocs from "./order.docs"
import * as publisherDocs from "./publisher.docs"
import * as reviewDocs from "./review.docs"

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
      get: bookDocs.getAllBooksDoc,
      post: bookDocs.postBookDoc,
    },
    "/api/book/:id": {
      get: bookDocs.getBookByIdDoc,
      patch: bookDocs.patchBookDoc,
      delete: bookDocs.deleteBookDoc,
    },
    "/api/author": {
      get: authorDocs.getAllAuthorsDoc,
      post: authorDocs.postAuthorDoc,
    },
    "/api/author/:id": {
      get: authorDocs.getAuthorByIdDoc,
      patch: authorDocs.patchAuthorDoc,
      delete: authorDocs.deleteAuthorDoc,
    },
    "/api/category": {
      get: categoryDocs.getModelsDoc,
    },
    "/api/category/:name": {
      get: categoryDocs.getCategoryDoc,
    },
    "/api/customer": {
      get: customerDocs.getAllCustomersDoc,
    },
    "/api/customer/:id": {
      get: customerDocs.getCustomerByIdDoc,
      patch: customerDocs.patchCustomerDoc,
      delete: customerDocs.deleteCustomerDoc,
    },
    "/api/customer/register": {
      post: customerSessionDocs.postRegisterCustomerDoc,
    },
    "/api/customer/login": {
      post: customerSessionDocs.postLoginCustomerDoc,
    },
    "/api/customer/logout": {
      post: customerSessionDocs.postLogoutCustomerDoc,
    },
    "/api/genre": {
      get: genreDocs.getAllGenresDoc,
      post: genreDocs.postGenreDoc,
    },
    "/api/genre/:id": {
      get: genreDocs.getGenreByIdDoc,
      patch: genreDocs.patchGenreDoc,
      delete: genreDocs.deleteGenreDoc,
    },
    "/api/image/:id": {
      get: getImageByIdDocs,
    },
    "/api/order": {
      get: orderDocs.getAllOrdersDoc,
      post: orderDocs.postOrderDoc,
    },
    "/api/order/:id": {
      get: orderDocs.getOrderByIdDoc,
      delete: orderDocs.deleteOrderDoc,
    },
    "/api/publisher": {
      get: publisherDocs.getAllPublishersDoc,
      post: publisherDocs.postPublisherDoc,
    },
    "/api/publisher/:id": {
      get: publisherDocs.getPublisherByIdDoc,
      patch: publisherDocs.patchPublisherDoc,
      delete: publisherDocs.deletePublisherDoc,
    },
    "/api/review": {
      get: reviewDocs.getAllReviewsDoc,
      post: reviewDocs.postReviewDoc,
    },
    "/api/review/:id": {
      get: reviewDocs.getReviewByIdDoc,
      delete: reviewDocs.deleteReviewDoc,
    },
  },
}

export default swaggerSpec
