//  400
export const globalErrorSchema = (message: string | null = null) => {
  return {
    description: "Error getting data",
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
              example: 400,
            },
            message: {
              type: "string",
              description: "Error description",
              example: message || "Bad Request",
            },
          },
        },
      },
    },
  }
}

// 404
export const notFoundSchema = (method: string, originalUrl: string) => {
  return {
    description: "Route not found",
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
              example: 404,
            },
            message: {
              type: "string",
              description: "Error description",
              example: `Route ${method} ${originalUrl} Not found`,
            },
          },
        },
      },
    },
  }
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
export const internalErrorSchema = {
  description: "Internal Server Error",
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
            example: 500,
          },
          message: {
            type: "string",
            description: "Error description",
            example: "Internal Server Error",
          },
        },
      },
    },
  },
}
