import { authorData } from "./data"
import {
  dbErrorSchema,
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "./swaggerErrorSchemas"

// @route GET /api/author
export const getAllAuthorsDoc = {
  tags: ["Author"],
  summary: "Get authors list",
  description: "Get authors list by page, order and filters",
  operationId: "getAllAuthorsDoc",
  parameters: [
    {
      in: "query",
      name: "page",
      description: "The list's page number.",
      required: true,
      schema: {
        type: "number",
      },
      example: 0,
    },
    {
      in: "query",
      name: "sort",
      description: "The value to sort the list order.",
      required: true,
      schema: {
        type: "string",
        enum: ["first_name", "last_name"],
      },
      example: "last_name",
    },
    {
      in: "query",
      name: "order",
      description: "Defines order of elements list",
      required: true,
      schema: {
        type: "string",
        enum: ["asc", "desc"],
      },
      example: "asc",
    },
    {
      in: "query",
      name: "name",
      description: "Filter by authors name. Exact or parcial.",
      schema: {
        type: "string",
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
                description: "Array of author objects",
                example: [authorData],
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
    400: globalErrorSchema("Error getting Authors"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/author"),
    500: internalErrorSchema,
  },
}

// @route GET /api/author/:id
export const getAuthorByIdDoc = {
  tags: ["Author"],
  summary: "Get author by Id",
  description: "Get single author by param Id",
  operationId: "getAuthorByIdDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Author Id",
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
                description: "Author object data",
                example: authorData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Author not found"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/author/id"),
    500: internalErrorSchema,
  },
}

// @route POST /api/author
export const postAuthorDoc = {
  tags: ["Author"],
  summary: "Post new author",
  description: "Create new author",
  operationId: "postAuthorDoc",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              description: "Author first name",
              example: "Michael",
              required: true,
            },
            last_name: {
              type: "string",
              description: "Author last name",
              example: "Langdon",
              required: true,
            },
            bio: {
              type: "string",
              description: "Author bio",
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
                description: "New created book",
                example: authorData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Author already registred"),
    401: unauthorizedSchema(),
    404: notFoundSchema("POST", "/api/author/:id"),
    409: dbErrorSchema("Error Creating Author"),
    500: internalErrorSchema,
  },
}

// @route PATCH /api/author/:id
export const patchAuthorDoc = {
  tags: ["Author"],
  summary: "Modify author by Id",
  description: "Modify author by Id and body partially or completely",
  operationId: "patchAuthorDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Author Id",
      required: true,
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
            first_name: {
              type: "string",
              description: "Author first name",
              example: "Michael",
            },
            last_name: {
              type: "string",
              description: "Author last name",
              example: "Langdon",
            },
            bio: {
              type: "string",
              description: "Author bio",
              example: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
            },
          },
        },
      },
    },
    required: true,
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
                description: "Author updated",
                example: authorData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("PATCH", "/api/book/:id"),
    409: dbErrorSchema("Error updating Author"),
    500: internalErrorSchema,
  },
}

// @route DELETE /api/author/:id
export const deleteAuthorDoc = {
  tags: ["Author"],
  summary: "Delete author by Id",
  description: "Delete author and it's relations by Id",
  operationId: "deleteAuthorDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Author Id",
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
                description: "Author Deleted",
                example: "Author successfully deleted",
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("DELETE", "/api/author/:id"),
    500: internalErrorSchema,
  },
}
