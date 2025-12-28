import { genreData } from "./data/index"
import {
  dbErrorSchema,
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "./swaggerErrorSchemas"

// @route /api/genre
export const getAllGenresDoc = {
  tags: ["Genre"],
  summary: "Get genres list",
  description: "Get genres list by page, order and filters",
  operationId: "getAllGenresDoc",
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
      name: "name",
      description: "Filter by genre name. Exact or parcial.",
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
                description: "Array of genres",
                example: [genreData],
              },
              count: {
                type: "number",
                description: "Total amount of list elements",
                example: 124,
              },
              page: {
                type: "number",
                description: "Actual page number",
                example: 0,
              },
              limit: {
                type: "number",
                description: "Last page number of the list",
                example: 6,
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
    400: globalErrorSchema("Error getting Genre list"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/genre"),
    500: internalErrorSchema,
  },
}

// @route GET /api/genre/:id
export const getGenreByIdDoc = {
  tags: ["Genre"],
  summary: "Get genre by Id",
  description: "Get single genre by param Id",
  operationId: "getGenreByIdDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Genre Id",
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
                description: "Book object data",
                example: genreData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Genre Not Found"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/genre/:id"),
    500: internalErrorSchema,
  },
}

// @route POST /api/genre
export const postGenreDoc = {
  tags: ["Genre"],
  summary: "Post new genre",
  description: "Create new genre",
  operationId: "postGenreDoc",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Genre name",
              example: "Fantasy",
              required: true,
            },
            description: {
              type: "string",
              description: "Genre description",
              example:
                "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
              required: true,
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
                example: genreData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Genre already registred"),
    401: unauthorizedSchema(),
    404: notFoundSchema("POST", "/api/genre"),
    409: dbErrorSchema("Error Creating Genre"),
    500: internalErrorSchema,
  },
}

// @route PATCH /api/genre/:id
export const patchGenreDoc = {
  tags: ["Genre"],
  summary: "Modify genre by Id",
  description: "Modify genre by Id and body partially or completely",
  operationId: "patchGenreDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Genre Id",
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
            name: {
              type: "string",
              description: "Genre name",
              example: "Fantasy",
            },
            description: {
              type: "string",
              description: "Genre description",
              example:
                "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
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
                description: "Book updated",
                example: genreData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("PATCH", "/api/genre/:id"),
    409: dbErrorSchema("Error updating Genre"),
    500: internalErrorSchema,
  },
}

// @route DELETE /api/genre/:id
export const deleteGenreDoc = {
  tags: ["Genre"],
  summary: "Delete genre by Id",
  description: "Delete genre by Id",
  operationId: "deleteGenreDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Genre Id",
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
                description: "Genre deleted",
                example: "Genre successfully deleted",
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("DELETE", "/api/genre/:id"),
    500: internalErrorSchema,
  },
}
