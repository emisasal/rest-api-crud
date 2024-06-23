import { customerData } from "./data/customerData"
import {
  dbErrorSchema,
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "./swaggerErrorSchemas"

// @route POST /api/customer/register
export const postRegisterCustomerDoc = {
  tags: ["Customer"],
  summary: "register new customer",
  description: "register new customer with name, last name email and password",
  operationId: "postRegisterCustomerDoc",
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
              required: true,
            },
            last_name: {
              type: "string",
              description: "Customer last name/s",
              example: "Aaronsohn",
              required: true,
            },
            email: {
              type: "email",
              description: "Customer email",
              example: "taaronsohnem@e-recht24.de",
              required: true,
            },
            password: {
              type: "string",
              description: "Customer new password",
              example: "som3NEwrANdomP@sswoddd",
              required: true,
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
                description: "Customer registred",
                example: customerData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Customer already registered"),
    404: notFoundSchema("POST", "/api/customer/register"),
    409: dbErrorSchema("Error creating Customer"),
    500: internalErrorSchema,
  },
}

// @route POST /api/customer/login
export const postLoginCustomerDoc = {
  tags: ["Customer"],
  summary: "Login customer",
  description: "Login customer with email and password",
  operationId: "postLoginCustomerDoc",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "email",
              description: "Customer email",
              example: "taaronsohnem@e-recht24.de",
              required: true,
            },
            password: {
              type: "string",
              description: "Customer new password",
              example: "som3NEwrANdomP@sswoddd",
              required: true,
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
                description: "Customer login",
                example: customerData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Customer already registered"),
    401: unauthorizedSchema("Invalid credentials"),
    404: notFoundSchema("POST", "/api/customer/login"),
    409: dbErrorSchema("Error creating Customer"),
    500: internalErrorSchema,
  },
}

// @route POST /api/customer/logout
export const postLogoutCustomerDoc = {
  tags: ["Customer"],
  summary: "logout customer",
  description: "Logout customer",
  operationId: "postLogoutCustomerDoc",
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
                type: "object",
                description: "Customer logout",
                example: "Customer logout",
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema(),
    404: notFoundSchema("POST", "/api/customer/logout"),
    500: internalErrorSchema,
  },
}
