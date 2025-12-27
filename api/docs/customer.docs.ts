import { customerData } from "./data/index"
import {
  dbErrorSchema,
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "./swaggerErrorSchemas"

// @route /api/customer
export const getAllCustomersDoc = {
  tags: ["Customer"],
  summary: "Get customers list",
  description: "Get customers list by page, order and filters",
  operationId: "getAllCustomersDoc",
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
      description: "Filter by customers name. Exact or parcial.",
      schema: {
        type: "string",
      },
    },
    {
      in: "query",
      name: "email",
      description: "Filter by customers email. Exact or parcial.",
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
                description: "Array of customers objects",
                example: [customerData],
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
    400: globalErrorSchema("Error getting Customers"),
    404: notFoundSchema("GET", "/api/customer"),
    500: internalErrorSchema,
  },
}

// @route GET /api/customer/:id
export const getCustomerByIdDoc = {
  tags: ["Customer"],
  summary: "Get customer by Id",
  description: "Get single customer by param Id",
  operationId: "getCustomerByIdDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Id of customer",
      required: true,
      example: 527,
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
                example: customerData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Customer not found"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/customer/:id"),
    500: internalErrorSchema,
  },
}

// @route PATCH /api/customer/:id
export const patchCustomerDoc = {
  tags: ["Customer"],
  summary: "Modify customer by Id",
  description: "Modify customer by param Id and body partially or completely",
  operationId: "patchCustomerDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Customer Id",
      required: true,
      example: 527,
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
              description: "Customer name/s",
              example: "Thor",
            },
            last_name: {
              type: "string",
              description: "Customer last name/s",
              example: "Aaronsohn",
            },
            email: {
              type: "email",
              description: "Customer email",
              example: "taaronsohnem@e-recht24.de",
            },
            password: {
              type: "string",
              description: "Customer new password",
              example: "som3NEwrANdomP@sswoddd",
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
                description: "Updated customer",
                example: customerData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("PATCH", "/api/customer/:id"),
    409: dbErrorSchema("Error updating customer"),
    500: internalErrorSchema,
  },
}

// @route DELETE /api/customer/:id
export const deleteCustomerDoc = {
  tags: ["Customer"],
  summary: "Delete customer by Id",
  description: "Delete customer and it's relations by Id",
  operationId: "deleteCustomerDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Customer Id",
      required: true,
      example: 527,
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
                description: "Customer deleted",
                example: "Customer successfully deleted",
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("DELETE", "/api/customer/:id"),
    500: internalErrorSchema,
  },
}
