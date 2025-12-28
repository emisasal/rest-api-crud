import {
  dbErrorSchema,
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "./swaggerErrorSchemas"
import { reviewData } from "./data/index"

// @route GET /api/REVIEW
export const getAllReviewsDoc = {
  tags: ["Review"],
  summary: "Get reviews list",
  description: "Get reviews list by page, order and filters",
  operationId: "getAllReviewsDoc",
  parameters: [
    {
      in: "query",
      name: "page",
      description: "List page number.",
      required: true,
      schema: {
        type: "number",
      },
      example: 0,
    },
    {
      in: "query",
      name: "sort",
      description: "Value to sort list order.",
      required: true,
      schema: {
        type: "string",
        enum: ["review_date", "rating"],
      },
      example: "review_date",
    },
    {
      in: "query",
      name: "order",
      description: "Defines the order of the list elements.",
      required: true,
      schema: {
        type: "string",
        enum: ["asc", "desc"],
      },
      example: "asc",
    },
    {
      in: "query",
      name: "book_id",
      description: "Filter by book Id.",
      schema: {
        type: "number",
      },
      example: 492,
    },
    {
      in: "query",
      name: "customer_id",
      description: "Filter by customer Id",
      schema: {
        type: "number",
      },
      example: 420,
    },
    {
      in: "query",
      name: "rateMin",
      description: "Filter rating range. Must include rateMax",
      schema: {
        type: "number",
      },
      example: 4,
    },
    {
      in: "query",
      name: "rateMax",
      description: "Filter rating range. Must include rateMin",
      schema: {
        type: "number",
      },
      example: 7,
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
                example: [reviewData],
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
    400: globalErrorSchema("Error getting Reviews list"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/review"),
    500: internalErrorSchema,
  },
}

// @route GET /api/review/:id
export const getReviewByIdDoc = {
  tags: ["Review"],
  summary: "Get review by Id",
  description: "Get single review by param Id",
  operationId: "getReviewByIdDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Review Id",
      required: true,
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
                description: "Review object data",
                example: reviewData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Review not found"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/review/:id"),
    500: internalErrorSchema,
  },
}

// @route POST /api/review
export const postReviewDoc = {
  tags: ["Review"],
  summary: "Post new review",
  description:
    "Create new review with book and customer id, rating and comment.",
  operationId: "postReviewDoc",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            book_id: {
              type: "number",
              description: "Book id",
              example: 486,
              required: true,
            },
            customer_id: {
              type: "number",
              description: "Customer Id",
              example: 420,
              required: true,
            },
            rating: {
              type: "number",
              description: "Review rate",
              example: 6,
              required: true,
            },
            comment: {
              type: "string",
              description: "Customer review comment",
              example: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
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
                description: "New review created",
                example: reviewData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Review for book already exist"),
    401: unauthorizedSchema(),
    404: notFoundSchema("POST", "/api/review"),
    409: dbErrorSchema("Review for book already exist"),
    500: internalErrorSchema,
  },
}

// @route DELETE /api/review/:id
export const deleteReviewDoc = {
  tags: ["Review"],
  summary: "Delete review by Id",
  description: "Delete review and it's relations by Id",
  operationId: "deleteReviewDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Review Id",
      required: true,
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
                description: "Review deleted",
                example: "Review successfully deleted",
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("DELETE", "/api/review/:id"),
    409: dbErrorSchema("Error deleting Review"),
    500: internalErrorSchema,
  },
}
