import {
  dbErrorSchema,
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "./swaggerErrorSchemas"
import { orderData } from "./data"

// @route GET /api/order
export const getAllOrdersDoc = {
  tags: ["Order"],
  summary: "Get orders list",
  description: "Get orders list by page, order and filters",
  operationId: "getAllOrdersDoc",
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
        enum: ["order_date", "total_amount"],
      },
      example: "order_date",
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
      name: "customer",
      description: "Filter by customer Id.",
      schema: {
        type: "number",
      },
    },
    {
      in: "query",
      name: "dateStart",
      description:
        "initial date to filter orders. Must also include 'dateEnd'.",
      schema: {
        type: "date",
      },
      example: "yyyy-MM-dd",
    },
    {
      in: "query",
      name: "dateEnd",
      description: "End date to filter orders. Must also include 'dateStart'.",
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
                description: "Array of order objects",
                example: [orderData],
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
    400: globalErrorSchema("Error getting Orders"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/order"),
    500: internalErrorSchema,
  },
}

// @route GET /api/order/:id
export const getOrderByIdDoc = {
  tags: ["Order"],
  summary: "Get order by Id",
  description: "Get single order by param Id",
  operationId: "getOrderByIdDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Order Id",
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
                description: "Order object data",
                example: orderData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Order not found"),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/order/:id"),
    500: internalErrorSchema,
  },
}

// @route POST /api/order
export const postOrderDoc = {
  tags: ["Order"],
  summary: "Post new order",
  description:
    "Create new order with customer and books id's relation for orders detail",
  operationId: "postOrderDoc",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            customer_id: {
              type: "number",
              description: "Customer Id",
              example: 480,
              required: true,
            },
            books: {
              type: "array",
              description: "List of books",
              example: [{ book_id: 407, quantity: 2 }],
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
                example: orderData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("POST", "/api/order"),
    409: dbErrorSchema("Error creating Order"),
    500: internalErrorSchema,
  },
}

// @route DELETE /api/delete/:id
export const deleteOrderDoc = {
  tags: ["Order"],
  summary: "Delete order by Id",
  description: "Delete order by Id and related order details",
  operationId: "deleteOrderDoc",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Order Id",
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
                description: "Order deleted",
                example: "Order successfully deleted",
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("DELETE", "/api/order/:id"),
    409: dbErrorSchema("Error deleting Order"),
    500: internalErrorSchema,
  },
}
