import { Types } from "ts-openapi"

//  400
export const globalErrorSchema = (message: string | null = null) => {
  return Types.Object({
    description: "Error getting data",
    properties: {
      success: Types.Boolean({
        description: "Response not successful",
      }),
      statusCode: Types.Integer({
        description: "Response status code",
      }),
      message: Types.String({
        description: "Error description",
      }),
    },
    example: {
      success: false,
      statusCode: 400,
      message: message || "Bad Request",
    },
  })
}

// 401
export const unauthorizedSchema = (message: string | null = null) => {
  return Types.Object({
    description: "Unauthorized",
    properties: {
      success: Types.Boolean({
        description: "Response not successful",
      }),
      statusCode: Types.Integer({
        description: "Response status code",
      }),
      message: Types.String({
        description: "Unauthorized",
      }),
    },
    example: {
      success: false,
      statusCode: 401,
      message: message || "Unauthorized",
    },
  })
}

// 404
export const notFoundSchema = (method: string, originalUrl: string) => {
  return Types.Object({
    description: "Route not found",
    properties: {
      success: Types.Boolean({
        description: "Response not successful",
      }),
      statusCode: Types.Integer({
        description: "Response status code",
      }),
      message: Types.String({
        description: "Error description",
      }),
    },
    example: {
      success: false,
      statusCode: 404,
      message: `Route ${method} ${originalUrl} Not found`,
    },
  })
}

// 409
export const dbErrorSchema = (message: string) => {
  return {
    description: "Error getting books list",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Response not successful",
              example: false,
            },
            statusCode: {
              type: "number",
              description: "Response status code",
              example: 409,
            },
            message: {
              type: "string",
              description: "Error description",
              example: message,
            },
          },
        },
      },
    },
  }
}

// 422
export const unprocessableContent = (message: string) => {
  return {
    description: "Unprocessable Content",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Response not successful",
              example: false,
            },
            statusCode: {
              type: "number",
              description: "Response status code",
              example: 422,
            },
            message: {
              type: "string",
              description: "Error description",
              example: message,
            },
          },
        },
      },
    },
  }
}

// 500
export const internalErrorSchema = Types.Object({
  description: "Internal Server Error",
  properties: {
    success: Types.Boolean({
      description: "Response not successful",
    }),
    statusCode: Types.Integer({
      description: "Response status code",
    }),
    message: Types.String({
      description: "Error description",
    }),
  },
  example: {
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  },
})
