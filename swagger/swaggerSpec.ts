import {
  deleteAuthorDoc,
  getAllAuthorsDoc,
  getAuthorByIdDoc,
  patchAuthorDoc,
  postAuthorDoc,
} from "./authorDocs"
import {
  deleteBookDoc,
  getAllBooksDoc,
  getBookByIdDoc,
  patchBookDoc,
  postBookDoc,
} from "./bookDocs"

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
      name: "Order Detail",
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
  },
}

export default swaggerSpec
