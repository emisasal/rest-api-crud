import { bookData } from "./data/bookData"
import {
  dbErrorSchema,
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
} from "./swaggerErrorSchemas"

const { author, genre, publisher, ...bookOnly } = bookData

// @route GET /api/book
export const getAllBooksDoc = {
  tags: ["Book"],
  summary: "Get books list",
  description: "Get books list by page, order and filters",
  operationId: "getAllBooksDoc",
  parameters: [
    {
      in: "query",
      name: "page",
      description: "List page number.",
      required: "true",
      schema: {
        type: "number",
      },
      example: 0,
    },
    {
      in: "query",
      name: "sort",
      description: "Value to sort list order.",
      required: "true",
      schema: {
        type: "string",
        enum: ["title", "price", "publish_date"],
      },
      example: "title",
    },
    {
      in: "query",
      name: "order",
      description: "Defines the order of the list elements.",
      required: "true",
      schema: {
        type: "string",
        enum: ["asc", "desc"],
      },
      example: "asc",
    },
    {
      in: "query",
      name: "title",
      description: "Filter by book title. Exact or parcial.",
      schema: {
        type: "string",
      },
    },
    {
      in: "query",
      name: "author",
      description: "Filter by author name (first or last). Exact or parcial.",
      schema: {
        type: "string",
      },
    },
    {
      in: "query",
      name: "genre",
      description: "Filter by genre name. Exact or pacial.",
      schema: {
        type: "string",
      },
    },
    {
      in: "query",
      name: "publisher",
      description: "Filter by publisher name. Exact or pacial.",
      schema: {
        type: "string",
      },
    },
    {
      in: "query",
      name: "isbn",
      description: "Filter by isbn code. Exact or pacial.",
      schema: {
        type: "string",
      },
    },
    {
      in: "query",
      name: "dateStart",
      description:
        "initial date to filter by publishing date. Must also include 'dateEnd'.",
      schema: {
        type: "date",
      },
      example: "yyyy-MM-dd",
    },
    {
      in: "query",
      name: "dateEnd",
      description:
        "End date to filter by publishing date. Must also include 'dateStart'.",
      schema: {
        type: "date",
      },
      example: "yyyy-MM-dd",
    },
  ],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "Response successful",
                example: true,
              },
              statusCode: {
                type: "number",
                description: "Response status code",
                example: 200,
              },
              data: {
                type: "array",
                description: "Array of book objects",
                example: [bookData],
              },
              count: {
                type: "number",
                description: "Total amount of list elements",
                example: 732,
              },
              page: {
                type: "number",
                description: "Actual page number",
                example: 0,
              },
              limit: {
                type: "number",
                description: "Last page number of the list",
                example: 12,
              },
              cache: {
                type: "boolean",
                description: "Indicates if 'data' is returned from cache",
                example: true,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Error getting books"),
    404: notFoundSchema("GET", "/api/book"),
    500: internalErrorSchema,
  },
}

// @route GET /api/book/:id
export const getBookByIdDoc = {
  tags: ["Book"],
  summary: "Get book by Id",
  description: "Get single book by param Id",
  operationId: "getBookByIdDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Book Id",
      required: "true",
      schema: {
        type: "number",
      },
    },
  ],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "Response successful",
                example: true,
              },
              statusCode: {
                type: "number",
                description: "Response status code",
                example: 200,
              },
              data: {
                type: "array",
                description: "Book object data",
                example: bookData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Error getting book"),
    404: notFoundSchema("GET", "/api/book/:id"),
    500: internalErrorSchema,
  },
}

// @route POST /api/book
export const postBookDoc = {
  tags: ["Book"],
  summary: "Post new book",
  description: "Create new book with author, publisher and genre id's relation",
  operationId: "postBookDoc",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Book title",
              example: "What happened in 1971",
            },
            description: {
              type: "string",
              description: "Book description",
              example:
                "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
            },
            author_id: {
              type: "number",
              description: "Author Id",
              example: 391,
            },
            genre_id: {
              type: "number",
              description: "Genre Id",
              example: 7,
            },
            publisher_id: {
              type: "number",
              description: "Publisher Id",
              example: 12,
            },
            price: {
              type: "number",
              description: "Book price",
              example: 6.43,
            },
            publish_date: {
              type: "date",
              description: "Book publishing date",
              example: "2001-06-25T07:01:44.000Z",
            },
            isbn: {
              type: "string",
              description: "Book ISBN code",
              example: "502074967-2",
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    201: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "Response successful",
                example: true,
              },
              statusCode: {
                type: "number",
                description: "Response status code",
                example: 201,
              },
              data: {
                type: "object",
                description: "New book created",
                example: bookOnly,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Book already registred with id 123"),
    404: notFoundSchema("POST", "/api/book"),
    409: dbErrorSchema("Error creating book"),
    500: internalErrorSchema,
  },
}

// @route PATCH /api/book/:id
export const patchBookDoc = {
  tags: ["Book"],
  summary: "Modify book by Id",
  description: "Modify book by Id and body partially or completely",
  operationId: "patchBookDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Book Id",
      required: "true",
      schema: {
        type: "number",
      },
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "What happened in 1971",
            },
            description: {
              type: "string",
              example:
                "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
            },
            author_id: {
              type: "number",
              description: "Author Id",
              example: 391,
            },
            genre_id: {
              type: "number",
              description: "Genre Id",
              example: 7,
            },
            publisher_id: {
              type: "number",
              description: "Publisher Id",
              example: 12,
            },
            price: {
              type: "number",
              description: "Book price",
              example: 6.43,
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "Response successful",
                example: true,
              },
              statusCode: {
                type: "number",
                description: "Response status code",
                example: 200,
              },
              data: {
                type: "object",
                description: "Book updated",
                example: bookOnly,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    404: notFoundSchema("PATCH", "/api/book/:id"),
    409: dbErrorSchema("Error updating book"),
    500: internalErrorSchema,
  },
}

// @route DELETE /api/book/:id
export const deleteBookDoc = {
  tags: ["Book"],
  summary: "Delete book by Id",
  description: "Delete book and it's relations by Id",
  operationId: "deleteBookDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Book Id",
      required: "true",
      schema: {
        type: "number",
      },
    },
  ],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "Response successful",
                example: true,
              },
              statusCode: {
                type: "number",
                description: "Response status code",
                example: 200,
              },
              message: {
                type: "string",
                description: "Book deleted",
                example: "Book Id 123 Successfully Deleted",
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    404: notFoundSchema("DELETE", "/api/book/:id"),
    500: internalErrorSchema,
  },
}
