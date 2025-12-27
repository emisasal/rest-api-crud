import {
  dbErrorSchema,
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "./swaggerErrorSchemas"
import { publisherData } from "./data/index"

export const getAllPublishersDoc = {
  tags: ["Publisher"],
  summary: "Get publishers list",
  description: "Get publishers list by page, order and name",
  operationId: "getAllPublishersDoc",
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
      description: "Filter by publisher name. Exact or parcial.",
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
                description: "Array of book objects",
                example: [publisherData],
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
    400: globalErrorSchema("Error getting Publisher list"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/publisher"),
    500: internalErrorSchema,
  },
}

// @route GET /api/publisher/:id
export const getPublisherByIdDoc = {
  tags: ["Publisher"],
  summary: "Get publisher by Id",
  description: "Get single publisher by param Id",
  operationId: "getPublisherByIdDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Publisher Id",
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
                example: publisherData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Publisher not found"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/publisher/:id"),
    500: internalErrorSchema,
  },
}

// @route POST /api/publisher
export const postPublisherDoc = {
  tags: ["Publisher"],
  summary: "Post new publisher",
  description: "Create new publisher with name, contact name and phone number",
  operationId: "postPublisherDoc",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            publisher_name: {
              type: "string",
              description: "Publisher name",
              example: "Abshire-Farrell",
              required: true,
            },
            contact_name: {
              type: "string",
              description: "Contact name",
              example: "Tildie Dorking",
            },
            phone_number: {
              type: "string",
              description: "Publisher's phone number",
              example: "910-966-6762",
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
                example: publisherData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Error creating Publisher"),
    401: unauthorizedSchema(),
    404: notFoundSchema("POST", "/api/publisher"),
    409: dbErrorSchema("Publisher already registred"),
    500: internalErrorSchema,
  },
}

// @route PATCH /api/publisher/:id
export const patchPublisherDoc = {
  tags: ["Publisher"],
  summary: "Modify publisher by Id",
  description: "Modify publisher by Id and body partially or completely",
  operationId: "patchPublisherDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Publisher Id",
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
            publisher_name: {
              type: "string",
              description: "Publisher name",
              example: "Abshire-Farrell",
            },
            contact_name: {
              type: "string",
              description: "Contact name",
              example: "Tildie Dorking",
            },
            phone_number: {
              type: "string",
              description: "Publisher's phone number",
              example: "910-966-6762",
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
                example: publisherData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("PATCH", "/api/publisher/:id"),
    409: dbErrorSchema("Error updating publisher"),
    500: internalErrorSchema,
  },
}

// @route DELETE /api/publisher/:id
export const deletePublisherDoc = {
  tags: ["Publisher"],
  summary: "Delete publisher by Id",
  description: "Delete publisher and it's relations by Id",
  operationId: "deletePublisherDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Publisher Id",
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
                description: "Publisher deleted",
                example: "Publisher successfully deleted",
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("DELETE", "/api/publisher/:id"),
    409: dbErrorSchema("Error deleting publisher"),
    500: internalErrorSchema,
  },
}
